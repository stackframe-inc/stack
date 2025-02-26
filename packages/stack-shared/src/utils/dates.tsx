import { remainder } from "./math";

export function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}
import.meta.vitest?.test("isWeekend", ({ expect }) => {
  // Sunday (day 0)
  expect(isWeekend(new Date("2023-01-01"))).toBe(true);
  // Saturday (day 6)
  expect(isWeekend(new Date("2023-01-07"))).toBe(true);
  // Monday (day 1)
  expect(isWeekend(new Date("2023-01-02"))).toBe(false);
  // Friday (day 5)
  expect(isWeekend(new Date("2023-01-06"))).toBe(false);
});

const agoUnits = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [5, 'week'],
] as const;

export function fromNow(date: Date): string {
  return fromNowDetailed(date).result;
}
import.meta.vitest?.test("fromNow", ({ expect }) => {
  // Mock current date for consistent testing
  const now = new Date("2023-01-15T12:00:00.000Z");
  const originalDate = Date;

  // Save original Date implementation and create a fixed date
  const fixedDate = new Date(now);

  // Mock Date.now() to return our fixed time
  const originalNow = Date.now;
  Date.now = () => now.getTime();

  // Need to mock the Date constructor to ensure new Date() returns our fixed date
  const OriginalDate = global.Date;
  global.Date = function(this: any, ...args: any[]) {
    return args.length === 0 ? new OriginalDate(now) : new OriginalDate(...args);
  } as any;
  global.Date.now = Date.now;

  // Test past times
  expect(fromNow(new Date("2023-01-15T11:59:50.000Z"))).toBe("just now");
  expect(fromNow(new Date("2023-01-15T11:59:00.000Z"))).toBe("1 minute ago");
  expect(fromNow(new Date("2023-01-15T11:00:00.000Z"))).toBe("1 hour ago");
  expect(fromNow(new Date("2023-01-14T12:00:00.000Z"))).toBe("1 day ago");
  expect(fromNow(new Date("2023-01-08T12:00:00.000Z"))).toBe("1 week ago");

  // Test future times
  expect(fromNow(new Date("2023-01-15T12:00:10.000Z"))).toBe("just now");
  expect(fromNow(new Date("2023-01-15T12:01:00.000Z"))).toBe("in 1 minute");
  expect(fromNow(new Date("2023-01-15T13:00:00.000Z"))).toBe("in 1 hour");
  expect(fromNow(new Date("2023-01-16T12:00:00.000Z"))).toBe("in 1 day");
  expect(fromNow(new Date("2023-01-22T12:00:00.000Z"))).toBe("in 1 week");

  // Test very old dates (should use date format)
  expect(fromNow(new Date("2022-01-15T12:00:00.000Z"))).toMatch(/Jan 15, 2022/);

  // Restore original Date and Date.now
  global.Date = OriginalDate;
  Date.now = originalNow;
});

export function fromNowDetailed(date: Date): {
  result: string,
  /**
   * May be Infinity if the result will never change.
   */
  secondsUntilChange: number,
} {
  if (!(date instanceof Date)) {
    throw new Error(`fromNow only accepts Date objects (received: ${date})`);
  }

  const now = new Date();
  const elapsed = now.getTime() - date.getTime();

  let remainingInUnit = Math.abs(elapsed) / 1000;
  if (remainingInUnit < 15) {
    return {
      result: 'just now',
      secondsUntilChange: 15 - remainingInUnit,
    };
  }
  let unitInSeconds = 1;
  for (const [nextUnitSize, unitName] of agoUnits) {
    const rounded = Math.round(remainingInUnit);
    if (rounded < nextUnitSize) {
      if (elapsed < 0) {
        return {
          result: `in ${rounded} ${unitName}${rounded === 1 ? '' : 's'}`,
          secondsUntilChange: remainder((remainingInUnit - rounded + 0.5) * unitInSeconds, unitInSeconds),
        };
      } else {
        return {
          result: `${rounded} ${unitName}${rounded === 1 ? '' : 's'} ago`,
          secondsUntilChange: remainder((rounded - remainingInUnit - 0.5) * unitInSeconds, unitInSeconds),
        };
      }
    }
    unitInSeconds *= nextUnitSize;
    remainingInUnit /= nextUnitSize;
  }

  return {
    result: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    secondsUntilChange: Infinity,
  };
}

/**
 * Returns a string representation of the given date in the format expected by the `datetime-local` input type.
 */
export function getInputDatetimeLocalString(date: Date): string {
  date = new Date(date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 19);
}
import.meta.vitest?.test("getInputDatetimeLocalString", ({ expect }) => {
  // Mock date to avoid timezone issues in tests
  const mockDate = new Date("2023-01-15T12:30:45.000Z");
  const result = getInputDatetimeLocalString(mockDate);

  // The result should be in the format YYYY-MM-DDTHH:MM:SS
  expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

  // Test with different dates
  const dates = [
    new Date("2023-01-01T00:00:00.000Z"),
    new Date("2023-06-15T23:59:59.000Z"),
    new Date("2023-12-31T12:34:56.000Z"),
  ];

  for (const date of dates) {
    const result = getInputDatetimeLocalString(date);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  }
});
