import { Store } from "@stackframe/stack-shared/dist/utils/stores";

export type TokenObject = {
  accessToken: string | null,
  refreshToken: string | null,
};

export function createEmptyTokenStore() {
  return new Store<TokenObject>({
    refreshToken: null,
    accessToken: null,
  });
}
