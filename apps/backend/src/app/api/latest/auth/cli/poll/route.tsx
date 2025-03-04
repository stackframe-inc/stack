import { prismaClient } from "@/prisma-client";
import { createSmartRouteHandler } from "@/route-handlers/smart-route-handler";
import { KnownErrors } from "@stackframe/stack-shared";
import { adaptSchema, clientOrHigherAuthTypeSchema, yupNumber, yupObject, yupString } from "@stackframe/stack-shared/dist/schema-fields";

export const POST = createSmartRouteHandler({
  metadata: {
    summary: "Poll CLI authentication status",
    description: "Check the status of a CLI authentication session using the polling code",
    tags: ["CLI Authentication"],
  },
  request: yupObject({
    auth: yupObject({
      type: clientOrHigherAuthTypeSchema,
      tenancy: adaptSchema.defined(),
    }).defined(),
    body: yupObject({
      polling_code: yupString().defined(),
    }).defined(),
  }),
  response: yupObject({
    statusCode: yupNumber().oneOf([200]).defined(),
    bodyType: yupString().oneOf(["json"]).defined(),
    body: yupObject({
      status: yupString().oneOf(["waiting", "success", "expired", "used"]).defined(),
      refresh_token: yupString().optional(),
    }).defined(),
  }),
  async handler({ auth: { tenancy }, body: { polling_code } }) {
    // Find the CLI auth attempt
    const cliAuth = await (prismaClient as any).cliAuthAttempt.findFirst({
      where: {
        tenancyId: tenancy.id,
        pollingCode: polling_code,
      },
    });

    if (!cliAuth) {
      throw new KnownErrors.SchemaError("Invalid polling code");
    }

    if (cliAuth.expiresAt < new Date()) {
      return {
        statusCode: 200,
        bodyType: "json",
        body: {
          status: "expired" as const,
        },
      };
    }

    if (cliAuth.usedAt) {
      return {
        statusCode: 200,
        bodyType: "json",
        body: {
          status: "used" as const,
        },
      };
    }

    if (!cliAuth.refreshToken) {
      return {
        statusCode: 200,
        bodyType: "json",
        body: {
          status: "waiting" as const,
        },
      };
    }

    // Mark as used
    await (prismaClient as any).cliAuthAttempt.update({
      where: {
        tenancyId_id: {
          tenancyId: tenancy.id,
          id: cliAuth.id,
        },
      },
      data: {
        usedAt: new Date(),
      },
    });

    return {
      statusCode: 200,
      bodyType: "json",
      body: {
        status: "success" as const,
        refresh_token: cliAuth.refreshToken,
      },
    };
  },
});
