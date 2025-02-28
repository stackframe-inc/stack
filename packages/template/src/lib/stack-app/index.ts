// Re-export everything from the original stack-app.ts file
export * from './interface';
export { stackAppInternalsSymbol } from './implementation/helpers/symbols';

// Import implementation classes
import { _StackClientAppImpl } from './implementation/client-app-impl';
import { _StackServerAppImpl } from './implementation/server-app-impl';
import { _StackAdminAppImpl } from './implementation/admin-app-impl';
import { stackAppInternalsSymbol as internalSymbol } from './implementation/helpers/symbols';

// Create and export the public-facing classes
export class StackClientApp<
  HasTokenStore extends boolean = boolean, 
  ProjectId extends string = string
> extends _StackClientAppImpl<HasTokenStore, ProjectId> {
  static [internalSymbol] = {
    fromClientJson<HasTokenStore extends boolean, ProjectId extends string>(json: any) {
      return new StackClientApp<HasTokenStore, ProjectId>(json as any);
    },
  };
}

export class StackServerApp<
  HasTokenStore extends boolean = boolean, 
  ProjectId extends string = string
> extends _StackServerAppImpl<HasTokenStore, ProjectId> {}

export class StackAdminApp<
  HasTokenStore extends boolean = boolean, 
  ProjectId extends string = string
> extends _StackAdminAppImpl<HasTokenStore, ProjectId> {}

// Re-export helper utilities that might be used by other modules
export {
  createCache,
  createCacheBySession
} from './implementation/helpers';
