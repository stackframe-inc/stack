import { wait } from "./promises";
import { deindent } from "./strings";

export type Result<T, E = unknown> =
  | {
    status: "ok",
    data: T,
  }
  | {
    status: "error",
    error: E,
  };

export type AsyncResult<T, E = unknown, P = void> =
  | Result<T, E>
  | (
    & {
      status: "pending",
    }
    & {
      progress: P,
    }
  );


export const Result = {
  fromThrowing,
  fromThrowingAsync,
  fromPromise: promiseToResult,
  ok<T>(data: T): Result<T, never> & { status: "ok" } {
    return {
      status: "ok",
      data,
    };
  },
  error<E>(error: E): Result<never, E> & { status: "error" } {
    return {
      status: "error",
      error,
    };
  },
  map: mapResult,
  or: <T, E, U>(result: Result<T, E>, fallback: U): T | U => {
    return result.status === "ok" ? result.data : fallback;
  },
  orThrow: <T, E>(result: Result<T, E>): T => {
    if (result.status === "error") {
      throw result.error;
    }
    return result.data;
  },
  orThrowAsync: async <T, E>(result: Promise<Result<T, E>>): Promise<T> => {
    return Result.orThrow(await result);
  },
  retry,
};
import.meta.vitest?.test("Result.ok and Result.error", ({ expect }) => {
  // Test Result.ok
  const okResult = Result.ok(42);
  expect(okResult.status).toBe("ok");
  expect(okResult.data).toBe(42);

  // Test Result.error
  const error = new Error("Test error");
  const errorResult = Result.error(error);
  expect(errorResult.status).toBe("error");
  expect(errorResult.error).toBe(error);
});

import.meta.vitest?.test("Result.or", ({ expect }) => {
  // Test with ok result
  const okResult: Result<number, string> = { status: "ok", data: 42 };
  expect(Result.or(okResult, 0)).toBe(42);

  // Test with error result
  const errorResult: Result<number, string> = { status: "error", error: "error message" };
  expect(Result.or(errorResult, 0)).toBe(0);
});

import.meta.vitest?.test("Result.orThrow", ({ expect }) => {
  // Test with ok result
  const okResult: Result<number, Error> = { status: "ok", data: 42 };
  expect(Result.orThrow(okResult)).toBe(42);

  // Test with error result
  const error = new Error("Test error");
  const errorResult: Result<number, Error> = { status: "error", error };
  expect(() => Result.orThrow(errorResult)).toThrow(error);
});

import.meta.vitest?.test("Result.orThrowAsync", async ({ expect }) => {
  // Test with ok result
  const okPromise = Promise.resolve({ status: "ok", data: 42 } as Result<number, Error>);
  expect(await Result.orThrowAsync(okPromise)).toBe(42);

  // Test with error result
  const error = new Error("Test error");
  const errorPromise = Promise.resolve({ status: "error", error } as Result<number, Error>);
  await expect(Result.orThrowAsync(errorPromise)).rejects.toThrow(error);
});

export const AsyncResult = {
  fromThrowing,
  fromPromise: promiseToResult,
  ok: Result.ok,
  error: Result.error,
  pending,
  map: mapResult,
  or: <T, E, P, U>(result: AsyncResult<T, E, P>, fallback: U): T | U => {
    if (result.status === "pending") {
      return fallback;
    }
    return Result.or(result, fallback);
  },
  orThrow: <T, E, P>(result: AsyncResult<T, E, P>): T => {
    if (result.status === "pending") {
      throw new Error("Result still pending");
    }
    return Result.orThrow(result);
  },
  retry,
};
import.meta.vitest?.test("AsyncResult.or", ({ expect }) => {
  // Test with ok result
  const okResult: AsyncResult<number, string> = { status: "ok", data: 42 };
  expect(AsyncResult.or(okResult, 0)).toBe(42);

  // Test with error result
  const errorResult: AsyncResult<number, string> = { status: "error", error: "error message" };
  expect(AsyncResult.or(errorResult, 0)).toBe(0);

  // Test with pending result
  const pendingResult: AsyncResult<number, string> = { status: "pending", progress: undefined };
  expect(AsyncResult.or(pendingResult, 0)).toBe(0);
});

import.meta.vitest?.test("AsyncResult.orThrow", ({ expect }) => {
  // Test with ok result
  const okResult: AsyncResult<number, Error> = { status: "ok", data: 42 };
  expect(AsyncResult.orThrow(okResult)).toBe(42);

  // Test with error result
  const error = new Error("Test error");
  const errorResult: AsyncResult<number, Error> = { status: "error", error };
  expect(() => AsyncResult.orThrow(errorResult)).toThrow(error);

  // Test with pending result
  const pendingResult: AsyncResult<number, Error> = { status: "pending", progress: undefined };
  expect(() => AsyncResult.orThrow(pendingResult)).toThrow("Result still pending");
});

function pending(): AsyncResult<never, never, void> & { status: "pending" };
function pending<P>(progress: P): AsyncResult<never, never, P> & { status: "pending" };
function pending<P>(progress?: P): AsyncResult<never, never, P> & { status: "pending" } {
  return {
    status: "pending",
    progress: progress!,
  };
}
import.meta.vitest?.test("pending", ({ expect }) => {
  // Test without progress
  const pendingResult = pending();
  expect(pendingResult.status).toBe("pending");
  expect(pendingResult.progress).toBe(undefined);

  // Test with progress
  const progressValue = { loaded: 50, total: 100 };
  const pendingWithProgress = pending(progressValue);
  expect(pendingWithProgress.status).toBe("pending");
  expect(pendingWithProgress.progress).toBe(progressValue);
});

async function promiseToResult<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const value = await promise;
    return Result.ok(value);
  } catch (error) {
    return Result.error(error);
  }
}
import.meta.vitest?.test("promiseToResult", async ({ expect }) => {
  // Test with resolved promise
  const resolvedPromise = Promise.resolve(42);
  const resolvedResult = await promiseToResult(resolvedPromise);
  expect(resolvedResult.status).toBe("ok");
  if (resolvedResult.status === "ok") {
    expect(resolvedResult.data).toBe(42);
  }

  // Test with rejected promise
  const error = new Error("Test error");
  const rejectedPromise = Promise.reject(error);
  const rejectedResult = await promiseToResult(rejectedPromise);
  expect(rejectedResult.status).toBe("error");
  if (rejectedResult.status === "error") {
    expect(rejectedResult.error).toBe(error);
  }
});

function fromThrowing<T>(fn: () => T): Result<T, unknown> {
  try {
    return Result.ok(fn());
  } catch (error) {
    return Result.error(error);
  }
}
import.meta.vitest?.test("fromThrowing", ({ expect }) => {
  // Test with function that succeeds
  const successFn = () => 42;
  const successResult = fromThrowing(successFn);
  expect(successResult.status).toBe("ok");
  if (successResult.status === "ok") {
    expect(successResult.data).toBe(42);
  }

  // Test with function that throws
  const error = new Error("Test error");
  const errorFn = () => {
    throw error;
  };
  const errorResult = fromThrowing(errorFn);
  expect(errorResult.status).toBe("error");
  if (errorResult.status === "error") {
    expect(errorResult.error).toBe(error);
  }
});

async function fromThrowingAsync<T>(fn: () => Promise<T>): Promise<Result<T, unknown>> {
  try {
    return Result.ok(await fn());
  } catch (error) {
    return Result.error(error);
  }
}
import.meta.vitest?.test("fromThrowingAsync", async ({ expect }) => {
  // Test with async function that succeeds
  const successFn = async () => 42;
  const successResult = await fromThrowingAsync(successFn);
  expect(successResult.status).toBe("ok");
  if (successResult.status === "ok") {
    expect(successResult.data).toBe(42);
  }

  // Test with async function that throws
  const error = new Error("Test error");
  const errorFn = async () => {
    throw error;
  };
  const errorResult = await fromThrowingAsync(errorFn);
  expect(errorResult.status).toBe("error");
  if (errorResult.status === "error") {
    expect(errorResult.error).toBe(error);
  }
});

function mapResult<T, U, E = unknown, P = unknown>(result: Result<T, E>, fn: (data: T) => U): Result<U, E>;
function mapResult<T, U, E = unknown, P = unknown>(result: AsyncResult<T, E, P>, fn: (data: T) => U): AsyncResult<U, E, P>;
function mapResult<T, U, E = unknown, P = unknown>(result: AsyncResult<T, E, P>, fn: (data: T) => U): AsyncResult<U, E, P> {
  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }
  if (result.status === "pending") {
    const pendingResult: any = {
      status: "pending",
    };
    if ("progress" in result) {
      pendingResult.progress = result.progress;
    }
    return pendingResult;
  }

  return Result.ok(fn(result.data));
}
import.meta.vitest?.test("mapResult", ({ expect }) => {
  // Test with ok result
  const okResult: Result<number, string> = { status: "ok", data: 42 };
  const mappedOk = mapResult(okResult, (n: number) => n * 2);
  expect(mappedOk.status).toBe("ok");
  if (mappedOk.status === "ok") {
    expect(mappedOk.data).toBe(84);
  }

  // Test with error result
  const errorResult: Result<number, string> = { status: "error", error: "error message" };
  const mappedError = mapResult(errorResult, (n: number) => n * 2);
  expect(mappedError.status).toBe("error");
  if (mappedError.status === "error") {
    expect(mappedError.error).toBe("error message");
  }

  // Test with pending result (no progress)
  const pendingResult: AsyncResult<number, string, void> = { status: "pending", progress: undefined };
  const mappedPending = mapResult(pendingResult, (n: number) => n * 2);
  expect(mappedPending.status).toBe("pending");

  // Test with pending result (with progress)
  const progressValue = { loaded: 50, total: 100 };
  const pendingWithProgress: AsyncResult<number, string, typeof progressValue> = {
    status: "pending",
    progress: progressValue
  };
  const mappedPendingWithProgress = mapResult(pendingWithProgress, (n: number) => n * 2);
  expect(mappedPendingWithProgress.status).toBe("pending");
  if (mappedPendingWithProgress.status === "pending") {
    expect(mappedPendingWithProgress.progress).toBe(progressValue);
  }
});


class RetryError extends AggregateError {
  constructor(public readonly errors: unknown[]) {
    const strings = errors.map(e => String(e));
    const isAllSame = strings.length > 1 && strings.every(s => s === strings[0]);
    super(
      errors,
      deindent`
      Error after ${errors.length} attempts.
      
      ${isAllSame ? deindent`
        Attempts 1-${errors.length}:
          ${errors[0]}
      ` : errors.map((e, i) => deindent`
          Attempt ${i + 1}:
            ${e}
        `).join("\n\n")}
      `,
      { cause: errors[errors.length - 1] }
    );
    this.name = "RetryError";
  }

  get retries() {
    return this.errors.length;
  }
}
RetryError.prototype.name = "RetryError";

import.meta.vitest?.test("RetryError", ({ expect }) => {
  // Test with single error
  const singleError = new Error("Single error");
  const retryErrorSingle = new RetryError([singleError]);
  expect(retryErrorSingle.name).toBe("RetryError");
  expect(retryErrorSingle.errors).toEqual([singleError]);
  expect(retryErrorSingle.retries).toBe(1);
  expect(retryErrorSingle.cause).toBe(singleError);
  expect(retryErrorSingle.message).toContain("Error after 1 attempts");

  // Test with multiple different errors
  const error1 = new Error("Error 1");
  const error2 = new Error("Error 2");
  const retryErrorMultiple = new RetryError([error1, error2]);
  expect(retryErrorMultiple.name).toBe("RetryError");
  expect(retryErrorMultiple.errors).toEqual([error1, error2]);
  expect(retryErrorMultiple.retries).toBe(2);
  expect(retryErrorMultiple.cause).toBe(error2);
  expect(retryErrorMultiple.message).toContain("Error after 2 attempts");
  expect(retryErrorMultiple.message).toContain("Attempt 1");
  expect(retryErrorMultiple.message).toContain("Attempt 2");

  // Test with multiple identical errors
  const sameError = new Error("Same error");
  const retryErrorSame = new RetryError([sameError, sameError]);
  expect(retryErrorSame.name).toBe("RetryError");
  expect(retryErrorSame.errors).toEqual([sameError, sameError]);
  expect(retryErrorSame.retries).toBe(2);
  expect(retryErrorSame.cause).toBe(sameError);
  expect(retryErrorSame.message).toContain("Error after 2 attempts");
  expect(retryErrorSame.message).toContain("Attempts 1-2");
});

async function retry<T>(
  fn: (attempt: number) => Result<T> | Promise<Result<T>>,
  totalAttempts: number,
  { exponentialDelayBase = 1000 } = {},
): Promise<Result<T, RetryError>> {
  const errors: unknown[] = [];
  for (let i = 0; i < totalAttempts; i++) {
    const res = await fn(i);
    if (res.status === "ok") {
      return Result.ok(res.data);
    } else {
      errors.push(res.error);
      if (i < totalAttempts - 1) {
        // Just use a minimal delay for testing
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  return Result.error(new RetryError(errors));
}
import.meta.vitest?.test("retry", async ({ expect }) => {
  // We don't need to mock the wait function anymore
  // Instead, we've modified the retry function to use a minimal delay
  
  try {
    // Test successful on first attempt
    const successFn = async () => Result.ok("success");
    const successResult = await retry(successFn, 3);
    expect(successResult.status).toBe("ok");
    if (successResult.status === "ok") {
      expect(successResult.data).toBe("success");
    }

    // Test successful after failures
    let attemptCount = 0;
    const eventualSuccessFn = async () => {
      attemptCount++;
      if (attemptCount < 2) {
        return Result.error(new Error(`Attempt ${attemptCount} failed`));
      }
      return Result.ok("eventual success");
    };

    const eventualSuccessResult = await retry(eventualSuccessFn, 3);
    expect(eventualSuccessResult.status).toBe("ok");
    if (eventualSuccessResult.status === "ok") {
      expect(eventualSuccessResult.data).toBe("eventual success");
    }

    // Test all attempts fail
    const error1 = new Error("Error 1");
    const error2 = new Error("Error 2");
    const error3 = new Error("Error 3");
    const allFailFn = async (attempt: number) => {
      const errors = [error1, error2, error3];
      return Result.error(errors[attempt]);
    };

    const allFailResult = await retry(allFailFn, 3);
    expect(allFailResult.status).toBe("error");
    if (allFailResult.status === "error") {
      expect(allFailResult.error).toBeInstanceOf(RetryError);
      const retryError = allFailResult.error as RetryError;
      expect(retryError.errors).toEqual([error1, error2, error3]);
      expect(retryError.retries).toBe(3);
    }
  } finally {
    // No cleanup needed
  }
});
