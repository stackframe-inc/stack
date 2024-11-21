// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nicify } from "@stackframe/stack-shared/dist/utils/strings";
import packageJson from "./package.json";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: `${packageJson.name}@${packageJson.version}`,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  enabled: process.env.NODE_ENV !== "development" && !process.env.CI,

  // Add exception metadata to the event
  beforeSend(event, hint) {
    const error = hint.originalException;
    let nicified;
    try {
      nicified = nicify(error);
    } catch (e) {
      nicified = `Error occurred during nicification: ${e}`;
    }
    if (error instanceof Error) {
      event.extra = {
        ...event.extra,
        cause: error.cause,
        errorProps: {
          ...error,
        },
        nicifiedError: nicify(error),
      };
    }
    return event;
  },
});
