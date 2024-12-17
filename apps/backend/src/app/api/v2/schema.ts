import {
  yupObject,
  yupArray,
  yupString,
  yupNumber,
  yupBoolean,
  yupMixed,
} from '@stackframe/stack-shared/dist/schema-fields';

export const endpointSchema = {
  '/': {
    GET: {
      default: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'text',
          body: yupString().defined(),
        },
      },
    },
  },
  '/users': {
    GET: {
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                primary_email: yupString().nullable(),
                primary_email_verified: yupBoolean().defined(),
                primary_email_auth_enabled: yupBoolean().defined(),
                display_name: yupString().nullable(),
                selected_team: yupObject({
                  created_at_millis: yupNumber().defined(),
                  server_metadata: yupMixed().optional().nullable(),
                  id: yupString().defined(),
                  display_name: yupString().defined(),
                  profile_image_url: yupString().nullable(),
                  client_metadata: yupMixed().optional().nullable(),
                  client_read_only_metadata: yupMixed().optional().nullable(),
                }).nullable(),
                selected_team_id: yupString().nullable(),
                profile_image_url: yupString().nullable(),
                signed_up_at_millis: yupNumber().defined(),
                has_password: yupBoolean().defined(),
                otp_auth_enabled: yupBoolean().defined(),
                passkey_auth_enabled: yupBoolean().defined(),
                client_metadata: yupMixed().nullable(),
                client_read_only_metadata: yupMixed().nullable(),
                server_metadata: yupMixed().nullable(),
                last_active_at_millis: yupNumber().defined(),
                oauth_providers: yupArray(
                  yupObject({
                    id: yupString().defined(),
                    account_id: yupString().defined(),
                    email: yupString().optional().nullable(),
                  }).defined(),
                ).defined(),
                auth_with_email: yupBoolean().defined(),
                requires_totp_mfa: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                primary_email: yupString().nullable(),
                primary_email_verified: yupBoolean().defined(),
                primary_email_auth_enabled: yupBoolean().defined(),
                display_name: yupString().nullable(),
                selected_team: yupObject({
                  created_at_millis: yupNumber().defined(),
                  server_metadata: yupMixed().optional().nullable(),
                  id: yupString().defined(),
                  display_name: yupString().defined(),
                  profile_image_url: yupString().nullable(),
                  client_metadata: yupMixed().optional().nullable(),
                  client_read_only_metadata: yupMixed().optional().nullable(),
                }).nullable(),
                selected_team_id: yupString().nullable(),
                profile_image_url: yupString().nullable(),
                signed_up_at_millis: yupNumber().defined(),
                has_password: yupBoolean().defined(),
                otp_auth_enabled: yupBoolean().defined(),
                passkey_auth_enabled: yupBoolean().defined(),
                client_metadata: yupMixed().nullable(),
                client_read_only_metadata: yupMixed().nullable(),
                server_metadata: yupMixed().nullable(),
                last_active_at_millis: yupNumber().defined(),
                oauth_providers: yupArray(
                  yupObject({
                    id: yupString().defined(),
                    account_id: yupString().defined(),
                    email: yupString().optional().nullable(),
                  }).defined(),
                ).defined(),
                auth_with_email: yupBoolean().defined(),
                requires_totp_mfa: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      server: {
        input: {
          body: yupObject({
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().nullable(),
              }).defined(),
            ).optional(),
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().nullable(),
              }).defined(),
            ).optional(),
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
  },
  '/teams': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      client: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            creator_user_id: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            creator_user_id: yupString().optional(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            creator_user_id: yupString().optional(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
    },
  },
  '/team-permissions': {
    GET: {
      client: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                user_id: yupString().defined(),
                team_id: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                user_id: yupString().defined(),
                team_id: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                user_id: yupString().defined(),
                team_id: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
  },
  '/team-member-profiles': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                team_id: yupString().defined(),
                user_id: yupString().defined(),
                display_name: yupString().nullable(),
                profile_image_url: yupString().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                user: yupObject({
                  id: yupString().defined(),
                  primary_email: yupString().nullable(),
                  primary_email_verified: yupBoolean().defined(),
                  primary_email_auth_enabled: yupBoolean().defined(),
                  display_name: yupString().nullable(),
                  selected_team: yupObject({
                    created_at_millis: yupNumber().defined(),
                    server_metadata: yupMixed().optional().nullable(),
                    id: yupString().defined(),
                    display_name: yupString().defined(),
                    profile_image_url: yupString().nullable(),
                    client_metadata: yupMixed().optional().nullable(),
                    client_read_only_metadata: yupMixed().optional().nullable(),
                  }).nullable(),
                  selected_team_id: yupString().nullable(),
                  profile_image_url: yupString().nullable(),
                  signed_up_at_millis: yupNumber().defined(),
                  has_password: yupBoolean().defined(),
                  otp_auth_enabled: yupBoolean().defined(),
                  passkey_auth_enabled: yupBoolean().defined(),
                  client_metadata: yupMixed().nullable(),
                  client_read_only_metadata: yupMixed().nullable(),
                  server_metadata: yupMixed().nullable(),
                  last_active_at_millis: yupNumber().defined(),
                  oauth_providers: yupArray(
                    yupObject({
                      id: yupString().defined(),
                      account_id: yupString().defined(),
                      email: yupString().optional().nullable(),
                    }).defined(),
                  ).defined(),
                  auth_with_email: yupBoolean().defined(),
                  requires_totp_mfa: yupBoolean().defined(),
                }).defined(),
                team_id: yupString().defined(),
                user_id: yupString().defined(),
                display_name: yupString().nullable(),
                profile_image_url: yupString().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                user: yupObject({
                  id: yupString().defined(),
                  primary_email: yupString().nullable(),
                  primary_email_verified: yupBoolean().defined(),
                  primary_email_auth_enabled: yupBoolean().defined(),
                  display_name: yupString().nullable(),
                  selected_team: yupObject({
                    created_at_millis: yupNumber().defined(),
                    server_metadata: yupMixed().optional().nullable(),
                    id: yupString().defined(),
                    display_name: yupString().defined(),
                    profile_image_url: yupString().nullable(),
                    client_metadata: yupMixed().optional().nullable(),
                    client_read_only_metadata: yupMixed().optional().nullable(),
                  }).nullable(),
                  selected_team_id: yupString().nullable(),
                  profile_image_url: yupString().nullable(),
                  signed_up_at_millis: yupNumber().defined(),
                  has_password: yupBoolean().defined(),
                  otp_auth_enabled: yupBoolean().defined(),
                  passkey_auth_enabled: yupBoolean().defined(),
                  client_metadata: yupMixed().nullable(),
                  client_read_only_metadata: yupMixed().nullable(),
                  server_metadata: yupMixed().nullable(),
                  last_active_at_millis: yupNumber().defined(),
                  oauth_providers: yupArray(
                    yupObject({
                      id: yupString().defined(),
                      account_id: yupString().defined(),
                      email: yupString().optional().nullable(),
                    }).defined(),
                  ).defined(),
                  auth_with_email: yupBoolean().defined(),
                  requires_totp_mfa: yupBoolean().defined(),
                }).defined(),
                team_id: yupString().defined(),
                user_id: yupString().defined(),
                display_name: yupString().nullable(),
                profile_image_url: yupString().nullable(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
  },
  '/team-invitations': {
    GET: {
      client: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                team_id: yupString().defined(),
                expires_at_millis: yupNumber().defined(),
                recipient_email: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                team_id: yupString().defined(),
                expires_at_millis: yupNumber().defined(),
                recipient_email: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                team_id: yupString().defined(),
                expires_at_millis: yupNumber().defined(),
                recipient_email: yupString().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
  },
  '/team-permission-definitions': {
    GET: {
      admin: {
        input: {
          params: yupObject({
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                description: yupString().optional(),
                contained_permission_ids: yupArray(
                  yupString().defined(),
                ).defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      admin: {
        input: {
          body: yupObject({
            id: yupString().defined(),
            description: yupString().optional(),
            contained_permission_ids: yupArray(
              yupString().defined(),
            ).optional(),
          }).defined(),
          params: yupObject({
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            description: yupString().optional(),
            contained_permission_ids: yupArray(yupString().defined()).defined(),
          }).defined(),
        },
      },
    },
  },
  '/email-templates': {
    GET: {
      admin: {
        input: {
          params: yupObject({
            type: yupString()
              .optional()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                type: yupString()
                  .defined()
                  .oneOf([
                    'email_verification',
                    'password_reset',
                    'magic_link',
                    'team_invitation',
                  ]),
                subject: yupString().defined(),
                content: yupMixed().nullable(),
                is_default: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
  },
  '/contact-channels': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                user_id: yupString().defined(),
                id: yupString().defined(),
                value: yupString().defined(),
                type: yupString().defined().oneOf(['email']),
                used_for_auth: yupBoolean().defined(),
                is_verified: yupBoolean().defined(),
                is_primary: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                user_id: yupString().defined(),
                id: yupString().defined(),
                value: yupString().defined(),
                type: yupString().defined().oneOf(['email']),
                used_for_auth: yupBoolean().defined(),
                is_verified: yupBoolean().defined(),
                is_primary: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                user_id: yupString().defined(),
                id: yupString().defined(),
                value: yupString().defined(),
                type: yupString().defined().oneOf(['email']),
                used_for_auth: yupBoolean().defined(),
                is_verified: yupBoolean().defined(),
                is_primary: yupBoolean().defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      client: {
        input: {
          body: yupObject({
            user_id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_primary: yupBoolean().optional(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            is_verified: yupBoolean().optional(),
            user_id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_primary: yupBoolean().optional(),
          }).optional(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            is_verified: yupBoolean().optional(),
            user_id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_primary: yupBoolean().optional(),
          }).optional(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
  },
  '/check-version': {
    POST: {
      default: {
        input: {
          body: yupObject({ clientVersion: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupMixed().defined(),
        },
      },
    },
  },
  '/check-feature-support': {
    POST: {
      default: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'text',
          body: yupString().defined(),
        },
      },
    },
  },
  '/users/me': {
    GET: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            selected_team: yupObject({
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            display_name: yupString().nullable(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            auth_with_email: yupBoolean().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            selected_team_id: yupString().nullable(),
            requires_totp_mfa: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
          }).nullable(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).nullable(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).nullable(),
        },
      },
    },
    DELETE: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      client: {
        input: {
          body: yupObject({
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            selected_team_id: yupString().optional().nullable(),
            totp_secret_base64: yupString().optional().nullable(),
            otp_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            selected_team: yupObject({
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            display_name: yupString().nullable(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            auth_with_email: yupBoolean().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            selected_team_id: yupString().nullable(),
            requires_totp_mfa: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
          }).nullable(),
        },
      },
      server: {
        input: {
          body: yupObject({
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
            selected_team_id: yupString().optional().nullable(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).nullable(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
            selected_team_id: yupString().optional().nullable(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).nullable(),
        },
      },
    },
  },
  '/users/[user_id]': {
    GET: {
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      server: {
        input: {
          body: yupObject({
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
            selected_team_id: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().optional().nullable(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            primary_email: yupString().optional().nullable(),
            primary_email_verified: yupBoolean().optional(),
            primary_email_auth_enabled: yupBoolean().optional(),
            passkey_auth_enabled: yupBoolean().optional(),
            password: yupString().optional().nullable(),
            password_hash: yupString().optional(),
            otp_auth_enabled: yupBoolean().optional(),
            totp_secret_base64: yupString().optional().nullable(),
            selected_team_id: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            team_id: yupString().optional(),
            limit: yupNumber().optional(),
            cursor: yupString().optional(),
            order_by: yupString().optional().oneOf(['signed_up_at']),
            desc: yupBoolean().optional(),
            query: yupString().optional(),
          }).optional(),
          params: yupObject({ user_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            primary_email: yupString().nullable(),
            primary_email_verified: yupBoolean().defined(),
            primary_email_auth_enabled: yupBoolean().defined(),
            display_name: yupString().nullable(),
            selected_team: yupObject({
              created_at_millis: yupNumber().defined(),
              server_metadata: yupMixed().optional().nullable(),
              id: yupString().defined(),
              display_name: yupString().defined(),
              profile_image_url: yupString().nullable(),
              client_metadata: yupMixed().optional().nullable(),
              client_read_only_metadata: yupMixed().optional().nullable(),
            }).nullable(),
            selected_team_id: yupString().nullable(),
            profile_image_url: yupString().nullable(),
            signed_up_at_millis: yupNumber().defined(),
            has_password: yupBoolean().defined(),
            otp_auth_enabled: yupBoolean().defined(),
            passkey_auth_enabled: yupBoolean().defined(),
            client_metadata: yupMixed().nullable(),
            client_read_only_metadata: yupMixed().nullable(),
            server_metadata: yupMixed().nullable(),
            last_active_at_millis: yupNumber().defined(),
            oauth_providers: yupArray(
              yupObject({
                id: yupString().defined(),
                account_id: yupString().defined(),
                email: yupString().optional().nullable(),
              }).defined(),
            ).defined(),
            auth_with_email: yupBoolean().defined(),
            requires_totp_mfa: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
  },
  '/webhooks/svix-token': {
    POST: {
      admin: {
        input: {},
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({ token: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/teams/[team_id]': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
    },
    DELETE: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      client: {
        input: {
          body: yupObject({
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            client_read_only_metadata: yupMixed().optional().nullable(),
            server_metadata: yupMixed().optional().nullable(),
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
            client_metadata: yupMixed().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            add_current_user: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({ team_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            created_at_millis: yupNumber().defined(),
            server_metadata: yupMixed().optional().nullable(),
            id: yupString().defined(),
            display_name: yupString().defined(),
            profile_image_url: yupString().nullable(),
            client_metadata: yupMixed().optional().nullable(),
            client_read_only_metadata: yupMixed().optional().nullable(),
          }).defined(),
        },
      },
    },
  },
  '/team-invitations/send-code': {
    POST: {
      client: {
        input: {
          body: yupObject({
            team_id: yupString().defined(),
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupBoolean().defined().oneOf([true]),
            id: yupString().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            team_id: yupString().defined(),
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupBoolean().defined().oneOf([true]),
            id: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            team_id: yupString().defined(),
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupBoolean().defined().oneOf([true]),
            id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/team-invitations/accept': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({}).defined(),
        },
      },
    },
  },
  '/projects/current': {
    GET: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            config: yupObject({
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            config: yupObject({
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            description: yupString().defined(),
            created_at_millis: yupNumber().defined(),
            user_count: yupNumber().defined(),
            is_production_mode: yupBoolean().defined(),
            config: yupObject({
              id: yupString().defined(),
              allow_localhost: yupBoolean().defined(),
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              legacy_global_jwt_signing: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).defined(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).defined(),
              create_team_on_sign_up: yupBoolean().defined(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().optional(),
            description: yupString().optional().nullable(),
            is_production_mode: yupBoolean().optional(),
            config: yupObject({
              sign_up_enabled: yupBoolean().optional(),
              credential_enabled: yupBoolean().optional(),
              magic_link_enabled: yupBoolean().optional(),
              passkey_enabled: yupBoolean().optional(),
              client_team_creation_enabled: yupBoolean().optional(),
              client_user_deletion_enabled: yupBoolean().optional(),
              legacy_global_jwt_signing: yupBoolean().optional(),
              allow_localhost: yupBoolean().optional(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).optional(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).optional(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).optional(),
              create_team_on_sign_up: yupBoolean().optional(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
            }).optional(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            description: yupString().defined(),
            created_at_millis: yupNumber().defined(),
            user_count: yupNumber().defined(),
            is_production_mode: yupBoolean().defined(),
            config: yupObject({
              id: yupString().defined(),
              allow_localhost: yupBoolean().defined(),
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              legacy_global_jwt_signing: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).defined(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).defined(),
              create_team_on_sign_up: yupBoolean().defined(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
    },
  },
  '/team-permission-definitions/[permission_id]': {
    DELETE: {
      admin: {
        input: {
          params: yupObject({
            permission_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            id: yupString().optional(),
            description: yupString().optional(),
            contained_permission_ids: yupArray(
              yupString().defined(),
            ).optional(),
          }).defined(),
          params: yupObject({
            permission_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            description: yupString().optional(),
            contained_permission_ids: yupArray(yupString().defined()).defined(),
          }).defined(),
        },
      },
    },
  },
  '/team-invitations/[id]': {
    DELETE: {
      client: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      server: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          query: yupObject({ team_id: yupString().defined() }).optional(),
          params: yupObject({ id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
  },
  '/email-templates/[type]': {
    GET: {
      admin: {
        input: {
          params: yupObject({
            type: yupString()
              .defined()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            type: yupString()
              .defined()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
            subject: yupString().defined(),
            content: yupMixed().nullable(),
            is_default: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      admin: {
        input: {
          params: yupObject({
            type: yupString()
              .defined()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            content: yupMixed().optional(),
            subject: yupString().optional(),
          }).defined(),
          params: yupObject({
            type: yupString()
              .defined()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            type: yupString()
              .defined()
              .oneOf([
                'email_verification',
                'password_reset',
                'magic_link',
                'team_invitation',
              ]),
            subject: yupString().defined(),
            content: yupMixed().nullable(),
            is_default: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
  },
  '/internal/api-keys': {
    GET: {
      admin: {
        input: {
          params: yupObject({ api_key_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                publishable_client_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                secret_server_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                super_secret_admin_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                id: yupString().defined(),
                description: yupString().defined(),
                expires_at_millis: yupNumber().defined(),
                manually_revoked_at_millis: yupNumber().optional(),
                created_at_millis: yupNumber().defined(),
              }).optional(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      admin: {
        input: {
          body: yupObject({
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            has_publishable_client_key: yupBoolean().defined(),
            has_secret_server_key: yupBoolean().defined(),
            has_super_secret_admin_key: yupBoolean().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            publishable_client_key: yupString().optional(),
            secret_server_key: yupString().optional(),
            super_secret_admin_key: yupString().optional(),
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
          }).defined(),
        },
      },
    },
  },
  '/contact-channels/verify': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/contact-channels/send-verification-code': {
    POST: {
      client: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      server: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      admin: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/internal/projects': {
    GET: {
      client: {
        input: {
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                display_name: yupString().defined(),
                description: yupString().defined(),
                created_at_millis: yupNumber().defined(),
                user_count: yupNumber().defined(),
                is_production_mode: yupBoolean().defined(),
                config: yupObject({
                  id: yupString().defined(),
                  allow_localhost: yupBoolean().defined(),
                  sign_up_enabled: yupBoolean().defined(),
                  credential_enabled: yupBoolean().defined(),
                  magic_link_enabled: yupBoolean().defined(),
                  passkey_enabled: yupBoolean().defined(),
                  legacy_global_jwt_signing: yupBoolean().defined(),
                  client_team_creation_enabled: yupBoolean().defined(),
                  client_user_deletion_enabled: yupBoolean().defined(),
                  oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                      enabled: yupBoolean().defined(),
                      type: yupString().defined().oneOf(['shared', 'standard']),
                      client_id: yupString().optional(),
                      client_secret: yupString().optional(),
                      facebook_config_id: yupString().optional(),
                      microsoft_tenant_id: yupString().optional(),
                    }).defined(),
                  ).defined(),
                  enabled_oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                    }).defined(),
                  ).defined(),
                  domains: yupArray(
                    yupObject({
                      domain: yupString().defined(),
                      handler_path: yupString().defined(),
                    }).defined(),
                  ).defined(),
                  email_config: yupObject({
                    type: yupString().defined().oneOf(['shared', 'standard']),
                    host: yupString().optional(),
                    port: yupNumber().optional(),
                    username: yupString().optional(),
                    password: yupString().optional(),
                    sender_name: yupString().optional(),
                    sender_email: yupString().optional(),
                  }).defined(),
                  create_team_on_sign_up: yupBoolean().defined(),
                  team_creator_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                  team_member_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                }).defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      server: {
        input: {
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                display_name: yupString().defined(),
                description: yupString().defined(),
                created_at_millis: yupNumber().defined(),
                user_count: yupNumber().defined(),
                is_production_mode: yupBoolean().defined(),
                config: yupObject({
                  id: yupString().defined(),
                  allow_localhost: yupBoolean().defined(),
                  sign_up_enabled: yupBoolean().defined(),
                  credential_enabled: yupBoolean().defined(),
                  magic_link_enabled: yupBoolean().defined(),
                  passkey_enabled: yupBoolean().defined(),
                  legacy_global_jwt_signing: yupBoolean().defined(),
                  client_team_creation_enabled: yupBoolean().defined(),
                  client_user_deletion_enabled: yupBoolean().defined(),
                  oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                      enabled: yupBoolean().defined(),
                      type: yupString().defined().oneOf(['shared', 'standard']),
                      client_id: yupString().optional(),
                      client_secret: yupString().optional(),
                      facebook_config_id: yupString().optional(),
                      microsoft_tenant_id: yupString().optional(),
                    }).defined(),
                  ).defined(),
                  enabled_oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                    }).defined(),
                  ).defined(),
                  domains: yupArray(
                    yupObject({
                      domain: yupString().defined(),
                      handler_path: yupString().defined(),
                    }).defined(),
                  ).defined(),
                  email_config: yupObject({
                    type: yupString().defined().oneOf(['shared', 'standard']),
                    host: yupString().optional(),
                    port: yupNumber().optional(),
                    username: yupString().optional(),
                    password: yupString().optional(),
                    sender_name: yupString().optional(),
                    sender_email: yupString().optional(),
                  }).defined(),
                  create_team_on_sign_up: yupBoolean().defined(),
                  team_creator_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                  team_member_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                }).defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
      admin: {
        input: {
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString().defined(),
                display_name: yupString().defined(),
                description: yupString().defined(),
                created_at_millis: yupNumber().defined(),
                user_count: yupNumber().defined(),
                is_production_mode: yupBoolean().defined(),
                config: yupObject({
                  id: yupString().defined(),
                  allow_localhost: yupBoolean().defined(),
                  sign_up_enabled: yupBoolean().defined(),
                  credential_enabled: yupBoolean().defined(),
                  magic_link_enabled: yupBoolean().defined(),
                  passkey_enabled: yupBoolean().defined(),
                  legacy_global_jwt_signing: yupBoolean().defined(),
                  client_team_creation_enabled: yupBoolean().defined(),
                  client_user_deletion_enabled: yupBoolean().defined(),
                  oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                      enabled: yupBoolean().defined(),
                      type: yupString().defined().oneOf(['shared', 'standard']),
                      client_id: yupString().optional(),
                      client_secret: yupString().optional(),
                      facebook_config_id: yupString().optional(),
                      microsoft_tenant_id: yupString().optional(),
                    }).defined(),
                  ).defined(),
                  enabled_oauth_providers: yupArray(
                    yupObject({
                      id: yupString()
                        .defined()
                        .oneOf([
                          'google',
                          'github',
                          'microsoft',
                          'spotify',
                          'facebook',
                          'discord',
                          'gitlab',
                          'bitbucket',
                          'linkedin',
                          'apple',
                          'x',
                        ]),
                    }).defined(),
                  ).defined(),
                  domains: yupArray(
                    yupObject({
                      domain: yupString().defined(),
                      handler_path: yupString().defined(),
                    }).defined(),
                  ).defined(),
                  email_config: yupObject({
                    type: yupString().defined().oneOf(['shared', 'standard']),
                    host: yupString().optional(),
                    port: yupNumber().optional(),
                    username: yupString().optional(),
                    password: yupString().optional(),
                    sender_name: yupString().optional(),
                    sender_email: yupString().optional(),
                  }).defined(),
                  create_team_on_sign_up: yupBoolean().defined(),
                  team_creator_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                  team_member_default_permissions: yupArray(
                    yupObject({ id: yupString().defined() }).defined(),
                  ).defined(),
                }).defined(),
              }).defined(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      client: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            description: yupString().optional().nullable(),
            is_production_mode: yupBoolean().optional(),
            config: yupObject({
              sign_up_enabled: yupBoolean().optional(),
              credential_enabled: yupBoolean().optional(),
              magic_link_enabled: yupBoolean().optional(),
              passkey_enabled: yupBoolean().optional(),
              client_team_creation_enabled: yupBoolean().optional(),
              client_user_deletion_enabled: yupBoolean().optional(),
              legacy_global_jwt_signing: yupBoolean().optional(),
              allow_localhost: yupBoolean().optional(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).optional(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).optional(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).optional(),
              create_team_on_sign_up: yupBoolean().optional(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
            }).optional(),
          }).defined(),
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            description: yupString().defined(),
            created_at_millis: yupNumber().defined(),
            user_count: yupNumber().defined(),
            is_production_mode: yupBoolean().defined(),
            config: yupObject({
              id: yupString().defined(),
              allow_localhost: yupBoolean().defined(),
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              legacy_global_jwt_signing: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).defined(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).defined(),
              create_team_on_sign_up: yupBoolean().defined(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            description: yupString().optional().nullable(),
            is_production_mode: yupBoolean().optional(),
            config: yupObject({
              sign_up_enabled: yupBoolean().optional(),
              credential_enabled: yupBoolean().optional(),
              magic_link_enabled: yupBoolean().optional(),
              passkey_enabled: yupBoolean().optional(),
              client_team_creation_enabled: yupBoolean().optional(),
              client_user_deletion_enabled: yupBoolean().optional(),
              legacy_global_jwt_signing: yupBoolean().optional(),
              allow_localhost: yupBoolean().optional(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).optional(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).optional(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).optional(),
              create_team_on_sign_up: yupBoolean().optional(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
            }).optional(),
          }).defined(),
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            description: yupString().defined(),
            created_at_millis: yupNumber().defined(),
            user_count: yupNumber().defined(),
            is_production_mode: yupBoolean().defined(),
            config: yupObject({
              id: yupString().defined(),
              allow_localhost: yupBoolean().defined(),
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              legacy_global_jwt_signing: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).defined(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).defined(),
              create_team_on_sign_up: yupBoolean().defined(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().defined(),
            description: yupString().optional().nullable(),
            is_production_mode: yupBoolean().optional(),
            config: yupObject({
              sign_up_enabled: yupBoolean().optional(),
              credential_enabled: yupBoolean().optional(),
              magic_link_enabled: yupBoolean().optional(),
              passkey_enabled: yupBoolean().optional(),
              client_team_creation_enabled: yupBoolean().optional(),
              client_user_deletion_enabled: yupBoolean().optional(),
              legacy_global_jwt_signing: yupBoolean().optional(),
              allow_localhost: yupBoolean().optional(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).optional(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).optional(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).optional(),
              create_team_on_sign_up: yupBoolean().optional(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).optional(),
            }).optional(),
          }).defined(),
          params: yupObject({ projectId: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            display_name: yupString().defined(),
            description: yupString().defined(),
            created_at_millis: yupNumber().defined(),
            user_count: yupNumber().defined(),
            is_production_mode: yupBoolean().defined(),
            config: yupObject({
              id: yupString().defined(),
              allow_localhost: yupBoolean().defined(),
              sign_up_enabled: yupBoolean().defined(),
              credential_enabled: yupBoolean().defined(),
              magic_link_enabled: yupBoolean().defined(),
              passkey_enabled: yupBoolean().defined(),
              legacy_global_jwt_signing: yupBoolean().defined(),
              client_team_creation_enabled: yupBoolean().defined(),
              client_user_deletion_enabled: yupBoolean().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                  enabled: yupBoolean().defined(),
                  type: yupString().defined().oneOf(['shared', 'standard']),
                  client_id: yupString().optional(),
                  client_secret: yupString().optional(),
                  facebook_config_id: yupString().optional(),
                  microsoft_tenant_id: yupString().optional(),
                }).defined(),
              ).defined(),
              enabled_oauth_providers: yupArray(
                yupObject({
                  id: yupString()
                    .defined()
                    .oneOf([
                      'google',
                      'github',
                      'microsoft',
                      'spotify',
                      'facebook',
                      'discord',
                      'gitlab',
                      'bitbucket',
                      'linkedin',
                      'apple',
                      'x',
                    ]),
                }).defined(),
              ).defined(),
              domains: yupArray(
                yupObject({
                  domain: yupString().defined(),
                  handler_path: yupString().defined(),
                }).defined(),
              ).defined(),
              email_config: yupObject({
                type: yupString().defined().oneOf(['shared', 'standard']),
                host: yupString().optional(),
                port: yupNumber().optional(),
                username: yupString().optional(),
                password: yupString().optional(),
                sender_name: yupString().optional(),
                sender_email: yupString().optional(),
              }).defined(),
              create_team_on_sign_up: yupBoolean().defined(),
              team_creator_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
              team_member_default_permissions: yupArray(
                yupObject({ id: yupString().defined() }).defined(),
              ).defined(),
            }).defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/sessions': {
    POST: {
      server: {
        input: {
          body: yupObject({
            user_id: yupString().defined(),
            expires_in_millis: yupNumber().optional(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            refresh_token: yupString().defined(),
            access_token: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            user_id: yupString().defined(),
            expires_in_millis: yupNumber().optional(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            refresh_token: yupString().defined(),
            access_token: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/team-member-profiles/[team_id]/[user_id]': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user: yupObject({
              id: yupString().defined(),
              primary_email: yupString().nullable(),
              primary_email_verified: yupBoolean().defined(),
              primary_email_auth_enabled: yupBoolean().defined(),
              display_name: yupString().nullable(),
              selected_team: yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).nullable(),
              selected_team_id: yupString().nullable(),
              profile_image_url: yupString().nullable(),
              signed_up_at_millis: yupNumber().defined(),
              has_password: yupBoolean().defined(),
              otp_auth_enabled: yupBoolean().defined(),
              passkey_auth_enabled: yupBoolean().defined(),
              client_metadata: yupMixed().nullable(),
              client_read_only_metadata: yupMixed().nullable(),
              server_metadata: yupMixed().nullable(),
              last_active_at_millis: yupNumber().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString().defined(),
                  account_id: yupString().defined(),
                  email: yupString().optional().nullable(),
                }).defined(),
              ).defined(),
              auth_with_email: yupBoolean().defined(),
              requires_totp_mfa: yupBoolean().defined(),
            }).defined(),
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user: yupObject({
              id: yupString().defined(),
              primary_email: yupString().nullable(),
              primary_email_verified: yupBoolean().defined(),
              primary_email_auth_enabled: yupBoolean().defined(),
              display_name: yupString().nullable(),
              selected_team: yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).nullable(),
              selected_team_id: yupString().nullable(),
              profile_image_url: yupString().nullable(),
              signed_up_at_millis: yupNumber().defined(),
              has_password: yupBoolean().defined(),
              otp_auth_enabled: yupBoolean().defined(),
              passkey_auth_enabled: yupBoolean().defined(),
              client_metadata: yupMixed().nullable(),
              client_read_only_metadata: yupMixed().nullable(),
              server_metadata: yupMixed().nullable(),
              last_active_at_millis: yupNumber().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString().defined(),
                  account_id: yupString().defined(),
                  email: yupString().optional().nullable(),
                }).defined(),
              ).defined(),
              auth_with_email: yupBoolean().defined(),
              requires_totp_mfa: yupBoolean().defined(),
            }).defined(),
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
    },
    PATCH: {
      client: {
        input: {
          body: yupObject({
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user: yupObject({
              id: yupString().defined(),
              primary_email: yupString().nullable(),
              primary_email_verified: yupBoolean().defined(),
              primary_email_auth_enabled: yupBoolean().defined(),
              display_name: yupString().nullable(),
              selected_team: yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).nullable(),
              selected_team_id: yupString().nullable(),
              profile_image_url: yupString().nullable(),
              signed_up_at_millis: yupNumber().defined(),
              has_password: yupBoolean().defined(),
              otp_auth_enabled: yupBoolean().defined(),
              passkey_auth_enabled: yupBoolean().defined(),
              client_metadata: yupMixed().nullable(),
              client_read_only_metadata: yupMixed().nullable(),
              server_metadata: yupMixed().nullable(),
              last_active_at_millis: yupNumber().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString().defined(),
                  account_id: yupString().defined(),
                  email: yupString().optional().nullable(),
                }).defined(),
              ).defined(),
              auth_with_email: yupBoolean().defined(),
              requires_totp_mfa: yupBoolean().defined(),
            }).defined(),
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            display_name: yupString().optional(),
            profile_image_url: yupString().optional().nullable(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            team_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user: yupObject({
              id: yupString().defined(),
              primary_email: yupString().nullable(),
              primary_email_verified: yupBoolean().defined(),
              primary_email_auth_enabled: yupBoolean().defined(),
              display_name: yupString().nullable(),
              selected_team: yupObject({
                created_at_millis: yupNumber().defined(),
                server_metadata: yupMixed().optional().nullable(),
                id: yupString().defined(),
                display_name: yupString().defined(),
                profile_image_url: yupString().nullable(),
                client_metadata: yupMixed().optional().nullable(),
                client_read_only_metadata: yupMixed().optional().nullable(),
              }).nullable(),
              selected_team_id: yupString().nullable(),
              profile_image_url: yupString().nullable(),
              signed_up_at_millis: yupNumber().defined(),
              has_password: yupBoolean().defined(),
              otp_auth_enabled: yupBoolean().defined(),
              passkey_auth_enabled: yupBoolean().defined(),
              client_metadata: yupMixed().nullable(),
              client_read_only_metadata: yupMixed().nullable(),
              server_metadata: yupMixed().nullable(),
              last_active_at_millis: yupNumber().defined(),
              oauth_providers: yupArray(
                yupObject({
                  id: yupString().defined(),
                  account_id: yupString().defined(),
                  email: yupString().optional().nullable(),
                }).defined(),
              ).defined(),
              auth_with_email: yupBoolean().defined(),
              requires_totp_mfa: yupBoolean().defined(),
            }).defined(),
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            display_name: yupString().nullable(),
            profile_image_url: yupString().nullable(),
          }).defined(),
        },
      },
    },
  },
  '/team-memberships/[team_id]/[user_id]': {
    POST: {
      server: {
        input: {
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      client: {
        input: {
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      server: {
        input: {
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
  },
  '/team-invitations/accept/details': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            team_id: yupString().defined(),
            team_display_name: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/team-invitations/accept/check-code': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            is_code_valid: yupBoolean().defined().oneOf([true]),
          }).defined(),
        },
      },
    },
  },
  '/integrations/neon/webhooks': {
    POST: {
      default: {
        input: {
          body: yupObject({
            url: yupString().defined(),
            description: yupString().optional(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ secret: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/integrations/neon/oauth-providers': {
    GET: {
      admin: {
        input: {
          params: yupObject({
            oauth_provider_id: yupString()
              .optional()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                id: yupString()
                  .defined()
                  .oneOf([
                    'google',
                    'github',
                    'microsoft',
                    'spotify',
                    'facebook',
                    'discord',
                    'gitlab',
                    'bitbucket',
                    'linkedin',
                    'apple',
                    'x',
                  ]),
                type: yupString().defined().oneOf(['shared', 'standard']),
                client_id: yupString().optional(),
                client_secret: yupString().optional(),
                facebook_config_id: yupString().optional(),
                microsoft_tenant_id: yupString().optional(),
              }).optional(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      admin: {
        input: {
          body: yupObject({
            id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
            type: yupString().optional().oneOf(['shared', 'standard']),
            client_id: yupString().optional(),
            client_secret: yupString().optional(),
            facebook_config_id: yupString().optional(),
            microsoft_tenant_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            oauth_provider_id: yupString()
              .optional()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
            type: yupString().defined().oneOf(['shared', 'standard']),
            client_id: yupString().optional(),
            client_secret: yupString().optional(),
            facebook_config_id: yupString().optional(),
            microsoft_tenant_id: yupString().optional(),
          }).optional(),
        },
      },
    },
  },
  '/integrations/neon/oauth': {
    GET: {
      default: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'text',
          body: yupString().defined(),
        },
      },
    },
  },
  '/integrations/neon/api-keys': {
    GET: {
      admin: {
        input: {
          params: yupObject({ api_key_id: yupString().optional() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            items: yupArray(
              yupObject({
                publishable_client_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                secret_server_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                super_secret_admin_key: yupObject({
                  last_four: yupString().defined(),
                }).optional(),
                id: yupString().defined(),
                description: yupString().defined(),
                expires_at_millis: yupNumber().defined(),
                manually_revoked_at_millis: yupNumber().optional(),
                created_at_millis: yupNumber().defined(),
              }).optional(),
            ).defined(),
            is_paginated: yupBoolean().defined(),
            pagination: yupObject({
              next_cursor: yupString().nullable(),
            }).optional(),
          }).defined(),
        },
      },
    },
    POST: {
      admin: {
        input: {
          body: yupObject({
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            has_publishable_client_key: yupBoolean().defined(),
            has_secret_server_key: yupBoolean().defined(),
            has_super_secret_admin_key: yupBoolean().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
            publishable_client_key: yupString().optional(),
            secret_server_key: yupString().optional(),
            super_secret_admin_key: yupString().optional(),
          }).defined(),
        },
      },
    },
  },
  '/internal/api-keys/[api_key_id]': {
    GET: {
      admin: {
        input: {
          params: yupObject({ api_key_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            publishable_client_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            secret_server_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            super_secret_admin_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
          }).optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            description: yupString().optional(),
            revoked: yupBoolean().optional().oneOf([true]),
          }).defined(),
          params: yupObject({ api_key_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            publishable_client_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            secret_server_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            super_secret_admin_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
          }).optional(),
        },
      },
    },
  },
  '/contact-channels/verify/check-code': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            is_code_valid: yupBoolean().defined().oneOf([true]),
          }).defined(),
        },
      },
    },
  },
  '/auth/sessions/current': {
    DELETE: {
      client: {
        input: {},
        output: { statusCode: [200], bodyType: 'success' },
      },
      server: {
        input: {},
        output: { statusCode: [200], bodyType: 'success' },
      },
      admin: {
        input: {},
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/contact-channels/[user_id]/[contact_channel_id]': {
    GET: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      client: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      server: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      client: {
        input: {
          body: yupObject({
            value: yupString().optional(),
            type: yupString().optional().oneOf(['email']),
            used_for_auth: yupBoolean().optional(),
            is_primary: yupBoolean().optional(),
          }).defined(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            is_verified: yupBoolean().optional(),
            value: yupString().optional(),
            type: yupString().optional().oneOf(['email']),
            used_for_auth: yupBoolean().optional(),
            is_primary: yupBoolean().optional(),
          }).optional(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            is_verified: yupBoolean().optional(),
            value: yupString().optional(),
            type: yupString().optional().oneOf(['email']),
            used_for_auth: yupBoolean().optional(),
            is_primary: yupBoolean().optional(),
          }).optional(),
          query: yupObject({
            user_id: yupString().optional(),
            contact_channel_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            user_id: yupString().defined(),
            id: yupString().defined(),
            value: yupString().defined(),
            type: yupString().defined().oneOf(['email']),
            used_for_auth: yupBoolean().defined(),
            is_verified: yupBoolean().defined(),
            is_primary: yupBoolean().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/password/update': {
    POST: {
      client: {
        input: {
          body: yupObject({
            old_password: yupString().defined(),
            new_password: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      server: {
        input: {
          body: yupObject({
            old_password: yupString().defined(),
            new_password: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      admin: {
        input: {
          body: yupObject({
            old_password: yupString().defined(),
            new_password: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/auth/password/sign-up': {
    POST: {
      client: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
            verification_callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
            verification_callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
            verification_callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/password/sign-in': {
    POST: {
      client: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            password: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            access_token: yupString().defined(),
            refresh_token: yupString().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/password/set': {
    POST: {
      client: {
        input: {
          body: yupObject({ password: yupString().defined() }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      server: {
        input: {
          body: yupObject({ password: yupString().defined() }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      admin: {
        input: {
          body: yupObject({ password: yupString().defined() }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/auth/password/send-reset-code': {
    POST: {
      client: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupString()
              .defined()
              .oneOf(['maybe, only if user with e-mail exists']),
          }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupString()
              .defined()
              .oneOf(['maybe, only if user with e-mail exists']),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            success: yupString()
              .defined()
              .oneOf(['maybe, only if user with e-mail exists']),
          }).defined(),
        },
      },
    },
  },
  '/auth/password/reset': {
    POST: {
      default: {
        input: {
          body: yupObject({
            password: yupString().defined(),
            code: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/auth/passkey/sign-in': {
    POST: {
      default: {
        input: {
          body: yupObject({
            authentication_response: yupMixed().defined(),
            code: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            refresh_token: yupString().defined(),
            access_token: yupString().defined(),
            is_new_user: yupBoolean().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/mfa/sign-in': {
    POST: {
      default: {
        input: {
          body: yupObject({
            type: yupString().defined().oneOf(['totp']),
            totp: yupString().defined(),
            code: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            refresh_token: yupString().defined(),
            access_token: yupString().defined(),
            is_new_user: yupBoolean().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/passkey/initiate-passkey-authentication': {
    POST: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).defined(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/passkey/initiate-passkey-registration': {
    POST: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).optional(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).optional(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            options_json: yupMixed().defined(),
            code: yupString().defined(),
          }).optional(),
        },
      },
    },
  },
  '/auth/passkey/register': {
    POST: {
      default: {
        input: {
          body: yupObject({
            credential: yupMixed().defined(),
            code: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ user_handle: yupString().defined() }).optional(),
        },
      },
    },
  },
  '/auth/oauth/token': {
    POST: {
      default: {
        input: {
          body: yupObject({
            grant_type: yupString()
              .defined()
              .oneOf(['authorization_code', 'refresh_token']),
          }).defined(),
        },
        output: {
          statusCode: [],
          bodyType: 'json',
          headers: yupMixed().defined(),
          body: yupMixed().defined(),
        },
      },
    },
  },
  '/auth/otp/sign-in': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            refresh_token: yupString().defined(),
            access_token: yupString().defined(),
            is_new_user: yupBoolean().defined(),
            user_id: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/otp/send-sign-in-code': {
    POST: {
      client: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ nonce: yupString().defined() }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ nonce: yupString().defined() }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            email: yupString().defined(),
            callback_url: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ nonce: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/team-permissions/[team_id]/[user_id]/[permission_id]': {
    POST: {
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            user_id: yupString().defined(),
            team_id: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString().defined(),
            user_id: yupString().defined(),
            team_id: yupString().defined(),
          }).defined(),
        },
      },
    },
    DELETE: {
      server: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            permission_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
      admin: {
        input: {
          query: yupObject({
            team_id: yupString().optional(),
            user_id: yupString().optional(),
            permission_id: yupString().optional(),
            recursive: yupString().optional().oneOf(['true', 'false']),
          }).optional(),
          params: yupObject({
            team_id: yupString().defined(),
            user_id: yupString().defined(),
            permission_id: yupString().defined(),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
  },
  '/integrations/neon/oauth-providers/[oauth_provider_id]': {
    DELETE: {
      admin: {
        input: {
          body: yupObject({
            id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
          }).optional(),
          params: yupObject({
            oauth_provider_id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'success',
          headers: yupObject({}).optional(),
          body: yupMixed().optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            type: yupString().optional().oneOf(['shared', 'standard']),
            client_id: yupString().optional(),
            client_secret: yupString().optional(),
            facebook_config_id: yupString().optional(),
            microsoft_tenant_id: yupString().optional(),
          }).optional(),
          params: yupObject({
            oauth_provider_id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
          }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            id: yupString()
              .defined()
              .oneOf([
                'google',
                'github',
                'microsoft',
                'spotify',
                'facebook',
                'discord',
                'gitlab',
                'bitbucket',
                'linkedin',
                'apple',
                'x',
              ]),
            type: yupString().defined().oneOf(['shared', 'standard']),
            client_id: yupString().optional(),
            client_secret: yupString().optional(),
            facebook_config_id: yupString().optional(),
            microsoft_tenant_id: yupString().optional(),
          }).optional(),
        },
      },
    },
  },
  '/integrations/neon/projects/provision': {
    POST: {
      default: {
        input: {
          body: yupObject({ display_name: yupString().defined() }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            project_id: yupString().defined(),
            super_secret_admin_key: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/integrations/neon/internal/confirm': {
    POST: {
      server: {
        input: {
          body: yupObject({
            interaction_uid: yupString().defined(),
            project_id: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            authorization_code: yupString().defined(),
          }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({
            interaction_uid: yupString().defined(),
            project_id: yupString().defined(),
          }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            authorization_code: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/integrations/neon/oauth/authorize': {
    GET: {
      default: {
        input: {
          query: yupObject({
            client_id: yupString().defined(),
            redirect_uri: yupString().defined(),
            state: yupString().defined(),
            code_challenge: yupString().defined(),
            code_challenge_method: yupString().defined().oneOf(['S256']),
            response_type: yupString().defined().oneOf(['code']),
          }).defined(),
        },
        output: {},
      },
    },
  },
  '/integrations/neon/oauth/token': {
    POST: {
      default: {
        input: {
          body: yupObject({
            grant_type: yupString().defined().oneOf(['authorization_code']),
            code: yupString().defined(),
            code_verifier: yupString().defined(),
            redirect_uri: yupString().defined(),
          }).defined(),
        },
        output: {},
      },
    },
  },
  '/integrations/neon/api-keys/[api_key_id]': {
    GET: {
      admin: {
        input: {
          params: yupObject({ api_key_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            publishable_client_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            secret_server_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            super_secret_admin_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
          }).optional(),
        },
      },
    },
    PATCH: {
      admin: {
        input: {
          body: yupObject({
            description: yupString().optional(),
            revoked: yupBoolean().optional().oneOf([true]),
          }).defined(),
          params: yupObject({ api_key_id: yupString().defined() }).optional(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({
            publishable_client_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            secret_server_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            super_secret_admin_key: yupObject({
              last_four: yupString().defined(),
            }).optional(),
            id: yupString().defined(),
            description: yupString().defined(),
            expires_at_millis: yupNumber().defined(),
            manually_revoked_at_millis: yupNumber().optional(),
            created_at_millis: yupNumber().defined(),
          }).optional(),
        },
      },
    },
  },
  '/connected-accounts/[user_id]/[provider_id]/access-token': {
    POST: {
      client: {
        input: {
          body: yupObject({ scope: yupString().optional() }).defined(),
          params: yupObject({
            provider_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
      server: {
        input: {
          body: yupObject({ scope: yupString().optional() }).defined(),
          params: yupObject({
            provider_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
      admin: {
        input: {
          body: yupObject({ scope: yupString().optional() }).defined(),
          params: yupObject({
            provider_id: yupString().optional(),
            user_id: yupString().optional(),
          }).optional(),
        },
        output: {
          statusCode: [201],
          bodyType: 'json',
          headers: yupObject({}).optional(),
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/auth/sessions/current/refresh': {
    POST: {
      client: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
      server: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
      admin: {
        input: {},
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ access_token: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/contact-channels/[user_id]/[contact_channel_id]/send-verification-code': {
    POST: {
      client: {
        input: {
          body: yupObject({ callback_url: yupString().defined() }).defined(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      server: {
        input: {
          body: yupObject({ callback_url: yupString().defined() }).defined(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
      admin: {
        input: {
          body: yupObject({ callback_url: yupString().defined() }).defined(),
          params: yupObject({
            user_id: yupString().defined(),
            contact_channel_id: yupString().defined(),
          }).defined(),
        },
        output: { statusCode: [200], bodyType: 'success' },
      },
    },
  },
  '/auth/password/reset/check-code': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            is_code_valid: yupBoolean().defined().oneOf([true]),
          }).defined(),
        },
      },
    },
  },
  '/auth/oauth/authorize/[provider_id]': {
    GET: {
      default: {
        input: {
          query: yupObject({
            type: yupString().optional().oneOf(['authenticate', 'link']),
            token: yupString().optional(),
            provider_scope: yupString().optional(),
            error_redirect_url: yupString().optional(),
            error_redirect_uri: yupString().optional(),
            after_callback_redirect_url: yupString().optional(),
            client_id: yupString().defined(),
            client_secret: yupString().defined(),
            redirect_uri: yupString().defined(),
            scope: yupString().defined(),
            state: yupString().defined(),
            grant_type: yupString().defined().oneOf(['authorization_code']),
            code_challenge: yupString().defined(),
            code_challenge_method: yupString().defined(),
            response_type: yupString().defined(),
          }).defined(),
          params: yupObject({ provider_id: yupString().defined() }).defined(),
        },
        output: { statusCode: [302], bodyType: 'empty' },
      },
    },
  },
  '/auth/otp/sign-in/check-code': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            is_code_valid: yupBoolean().defined().oneOf([true]),
          }).defined(),
        },
      },
    },
  },
  '/auth/oauth/callback/[provider_id]': {
    GET: {
      default: {
        input: {
          params: yupObject({ provider_id: yupString().defined() }).defined(),
        },
        output: {
          statusCode: [307],
          bodyType: 'json',
          headers: yupMixed().defined(),
          body: yupMixed().defined(),
        },
      },
    },
    POST: {
      default: {
        input: {
          params: yupObject({ provider_id: yupString().defined() }).defined(),
        },
        output: {
          statusCode: [307],
          bodyType: 'json',
          headers: yupMixed().defined(),
          body: yupMixed().defined(),
        },
      },
    },
  },
  '/integrations/neon/oauth/idp/[[...route]]': {},
  '/integrations/neon/projects/transfer/confirm': {
    POST: {
      default: {
        input: { body: yupObject({ code: yupString().defined() }).defined() },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({ project_id: yupString().defined() }).defined(),
        },
      },
    },
  },
  '/integrations/neon/projects/transfer/initiate': {
    POST: {
      default: {
        input: {
          body: yupObject({ project_id: yupString().defined() }).defined(),
        },
        output: {
          statusCode: [200],
          bodyType: 'json',
          body: yupObject({
            confirmation_url: yupString().defined(),
          }).defined(),
        },
      },
    },
  },
  '/auth/oauth/connected-accounts/[provider_id]/access-token': {
    POST: {
      default: {
        input: {
          body: yupObject({ scope: yupString().optional() }).defined(),
          params: yupObject({ provider_id: yupString().defined() }).defined(),
        },
        output: {
          statusCode: [],
          bodyType: 'json',
          body: yupMixed().defined(),
        },
      },
    },
  },
};
