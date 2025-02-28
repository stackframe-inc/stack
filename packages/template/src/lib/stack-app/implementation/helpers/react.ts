// IF_PLATFORM react-like
import React, { useCallback } from "react";
import { AsyncCache } from "@stackframe/stack-shared/dist/utils/caches";
import { Result } from "@stackframe/stack-shared/dist/utils/results";
import { ReactPromise } from "@stackframe/stack-shared/dist/utils/promises";
import { suspendIfSsr } from "@stackframe/stack-shared/dist/utils/react";
import { concatStacktraces, throwErr } from "@stackframe/stack-shared/dist/utils/errors";

const cachePromiseByComponentId = new Map<string, ReactPromise<Result<unknown>>>();

export function useAsyncCache<D extends any[], T>(cache: AsyncCache<D, Result<T>>, dependencies: D, caller: string): T {
  // we explicitly don't want to run this hook in SSR
  suspendIfSsr(caller);

  const id = React.useId();

  const subscribe = useCallback((cb: () => void) => {
    const { unsubscribe } = cache.onStateChange(dependencies, () => {
      cachePromiseByComponentId.delete(id);
      cb();
    });
    return unsubscribe;
  }, [cache, ...dependencies]);
  
  const getSnapshot = useCallback(() => {
    // React checks whether a promise passed to `use` is still the same as the previous one by comparing the reference.
    // If we didn't cache here, this wouldn't work because the promise would be recreated every time the value changes.
    if (!cachePromiseByComponentId.has(id)) {
      cachePromiseByComponentId.set(id, cache.getOrWait(dependencies, "read-write"));
    }
    const promise = cachePromiseByComponentId.get(id);
    if (!promise) {
      throw new Error("Promise should exist in cache after setting it");
    }
    return promise as ReactPromise<Result<T>>;
  }, [cache, ...dependencies]);

  // note: we must use React.useSyncExternalStore instead of importing the function directly, as it will otherwise
  // throw an error ("can't import useSyncExternalStore from the server")
  const promise = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => throwErr(new Error("getServerSnapshot should never be called in useAsyncCache because we restrict to CSR earlier"))
  );

  // @ts-ignore - React.use is available in React 18+
  const result = React.use(promise);
  if (result.status === "error") {
    const error = result.error;
    if (error instanceof Error && !(error as any).__stackHasConcatenatedStacktraces) {
      concatStacktraces(error, new Error());
      (error as any).__stackHasConcatenatedStacktraces = true;
    }
    throw error;
  }
  return result.data;
}
// END_PLATFORM
