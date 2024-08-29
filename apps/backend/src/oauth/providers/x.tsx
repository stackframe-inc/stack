import { OAuthBaseProvider, TokenSet } from "./base";
import { OAuthUserInfo, validateUserInfo } from "../utils";
import { getEnvVariable } from "@stackframe/stack-shared/dist/utils/env";

export class XProvider extends OAuthBaseProvider {
  private constructor(
    ...args: ConstructorParameters<typeof OAuthBaseProvider>
  ) {
    super(...args);
  }

  static async create(options: { clientId: string, clientSecret: string }) {
    return new XProvider(
      ...(await OAuthBaseProvider.createConstructorArgs({
        issuer: "https://twitter.com",
        authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
        tokenEndpoint: "https://twitter.com/i/oauth2/token",
        redirectUri: getEnvVariable("STACK_BASE_URL") + "/api/v1/auth/oauth/callback/x",
        baseScope: "users.read offline.access",
        ...options,
      }))
    );
  }

  async postProcessUserInfo(tokenSet: TokenSet): Promise<OAuthUserInfo> {
    const headers = {
      Authorization: `Bearer ${tokenSet.accessToken}`,
    };
    // const { data: userInfo } = await fetch(
    //   "https://api.x.com/2/users/me?user.fields=id,name,profile_image_url",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${tokenSet.accessToken}`,
    //     },
    //   }
    // ).then((res) => res.json());

    const [userInfo, emailInfo] = await Promise.all([
      fetch("https://api.x.com/2/users/me?user.fields=id,name,profile_image_url", {
        headers,
      }).then((res) => res.json()),
      fetch("https://api.x.com/1.1/account/verify_credentials.json", {
        headers,
      }).then((res) => res.json()),
    ]);

    console.log(userInfo);
    console.log(emailInfo);

    return validateUserInfo({
      accountId: userInfo.id?.toString(),
      displayName: userInfo.name || userInfo.username,
      email: undefined, // X Oauth2.0 doesn't support email
      profileImageUrl: userInfo.profile_image_url as any,
      emailVerified: false,
    });
  }
}
