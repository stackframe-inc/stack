import { getEmailConfig, sendEmail, sendEmailFromTemplate } from "@/lib/emails";
import { getSoleTenancyFromProject } from "@/lib/tenancies";
import { prismaClient } from "@/prisma-client";
import { Project } from "@prisma/client";
import { getEnvVariable } from "@stackframe/stack-shared/dist/utils/env";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${getEnvVariable('CRON_SECRET')}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }


  // get projects from tenancy IDs
  const emails = await prismaClient.sentEmail.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    },
    include: {
      tenancy: {
        include: {
          project: true,
        }
      },
    }
  });

  const projectWithEmails: Record<string, { project: Project, emails: (typeof emails[number])[] } | undefined>
   = {};

  // dedupe by project
  for (const email of emails) {
    const projectId = email.tenancy.project.id;
    if (!projectWithEmails[projectId]) {
      projectWithEmails[projectId] = {
        project: email.tenancy.project,
        emails: [],
      };
    }
    projectWithEmails[projectId]!.emails.push(email);
  }

  const usersBase = await Promise.all(Object.entries(projectWithEmails).map(async ([projectId, projectWithEmail]) => {
    if (!projectWithEmail) {
      return [];
    }

    return await prismaClient.projectUser.findMany({
      where: {
        mirroredProjectId: {
          equals: 'internal',
        },
        serverMetadata: {
          path: ['managedProjectId'],
          array_contains: projectWithEmail.project.id,
        }
      },
      include: {
        contactChannels: {
          where: {
            isPrimary: "TRUE",
          }
        },
      }
    });
  }));

  const internal = await getSoleTenancyFromProject('internal');
  const emailConfig = await getEmailConfig(internal);

  await Promise.all(usersBase.flat().map(async (user) => {
    if (user.contactChannels.length === 0) {
      return;
    }
    const contactChannel = user.contactChannels[0];

    await sendEmail({
      tenancyId: internal.id,
      to: contactChannel.value,
      subject: `You have ${projectWithEmails[user.mirroredProjectId]?.emails.length} emails that failed to deliver in your project`,
      // list all the failed emails
      text: projectWithEmails[user.mirroredProjectId]?.emails.map(email => JSON.stringify(email.error)).join('\n'),
      emailConfig,
    });
  }));

  return Response.json({ success: true });
}
