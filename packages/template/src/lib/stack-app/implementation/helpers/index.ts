// Export symbols
export { stackAppInternalsSymbol } from './symbols';

// Export utility functions
export const createCache = <D extends any[], T>(fetcher: (dependencies: D) => Promise<T>) => {
  return new AsyncCache<D, Result<T>>(
    async (dependencies) => await Result.fromThrowingAsync(async () => await fetcher(dependencies)),
    {},
  );
};

export const createCacheBySession = <D extends any[], T>(fetcher: (session: InternalSession, extraDependencies: D) => Promise<T> ) => {
  return new AsyncCache<[InternalSession, ...D], Result<T>>(
    async ([session, ...extraDependencies]) => await Result.fromThrowingAsync(async () => await fetcher(session, extraDependencies)),
    {
      onSubscribe: ([session], refresh) => {
        const handler = session.onInvalidate(() => refresh());
        return () => handler.unsubscribe();
      },
    },
  );
};

// Export from other helper files
export { 
  getUrls, 
  getDefaultProjectId, 
  getDefaultPublishableClientKey, 
  getDefaultSecretServerKey, 
  getDefaultSuperSecretAdminKey, 
  getBaseUrl 
} from './utils';

export { 
  TokenObject, 
  createEmptyTokenStore 
} from './token-store';

export { 
  teamCreateOptionsToCrud, 
  teamUpdateOptionsToCrud 
} from './crud';

export { 
  WebAuthnError, 
  startAuthentication, 
  startRegistration 
} from './webauthn';

export {
  CookieHelper,
  createCookieHelper,
  createPlaceholderCookieHelper,
  getCookieClient,
  setOrDeleteCookieClient,
  setOrDeleteCookie,
  createBrowserCookieHelper,
  deleteCookieClient
} from './cookie';

// IF_PLATFORM react-like
export { useAsyncCache } from './react';
// END_PLATFORM

// Import necessary types
import { AsyncCache } from "@stackframe/stack-shared/dist/utils/caches";
import { InternalSession } from "@stackframe/stack-shared/dist/sessions";
import { Result } from "@stackframe/stack-shared/dist/utils/results";
