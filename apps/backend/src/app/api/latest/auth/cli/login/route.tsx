import { prismaClient } from "@/prisma-client";
import { createSmartRouteHandler } from "@/route-handlers/smart-route-handler";
import { KnownErrors } from "@stackframe/stack-shared";
import { adaptSchema, clientOrHigherAuthTypeSchema, yupNumber, yupObject, yupString } from "@stackframe/stack-shared/dist/schema-fields";

export const POST = createSmartRouteHandler({
  metadata: {
    summary: "Set refresh token for CLI authentication",
    description: "Set the refresh token for a CLI authentication session using the login code",
    tags: ["CLI Authentication"],
  },
  request: yupObject({
    auth: yupObject({
      type: clientOrHigherAuthTypeSchema,
      tenancy: adaptSchema.defined(),
    }).defined(),
    body: yupObject({
      login_code: yupString().defined(),
      refresh_token: yupString().defined(),
    }).defined(),
  }),
  response: yupObject({
    statusCode: yupNumber().oneOf([200]).defined(),
    bodyType: yupString().oneOf(["success"]).defined(),
  }),
  async handler({ auth: { tenancy }, body: { login_code, refresh_token } }) {
    // Find the CLI auth attempt
    const cliAuth = await (prismaClient as any).cliAuthAttempt.findFirst({
      where: {
        tenancyId: tenancy.id,
        loginCode: login_code,
        refreshToken: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!cliAuth) {
      throw new KnownErrors.SchemaError("Invalid login code or the code has expired");
    }

    // Update with refresh token
    await (prismaClient as any).cliAuthAttempt.update({
      where: {
        tenancyId_id: {
          tenancyId: tenancy.id,
          id: cliAuth.id,
        },
      },
      data: {
        refreshToken: refresh_token,
      },
    });

    return {
      statusCode: 200,
      bodyType: "success",
    };
  },
});
