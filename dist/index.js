"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  steam: () => steam
});
module.exports = __toCommonJS(index_exports);
var import_fetch = require("@better-fetch/fetch");
var import_zod = require("zod");
var import_api = require("better-auth/api");
var import_cookies = require("better-auth/cookies");
var wildcardMatch = (patterns) => (str) => {
  return patterns.some((pattern) => {
    const regex = new RegExp(
      `^${pattern.replace(/\*/g, ".*").replace(/\?/g, ".")}$`
    );
    return regex.test(str);
  });
};
var STEAM_BASE_URL = "https://api.steampowered.com/";
var steam = (config) => ({
  id: "steam",
  endpoints: {
    signInWithSteam: (0, import_api.createAuthEndpoint)(
      "/sign-in/steam",
      {
        method: "POST",
        metadata: {
          openapi: {
            description: "Sign in with Steam using OpenID",
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        url: { type: "string" },
                        redirect: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        body: import_zod.z.object({
          email: import_zod.z.string().meta({ description: "The email to use for the user" }).optional(),
          errorCallbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to if an error occurs"
          }).optional(),
          callbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to after the user is signed in"
          }).optional(),
          newUserCallbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to if the user is new"
          }).optional(),
          disableRedirect: import_zod.z.boolean().meta({ description: "Whether to disable redirect" }).optional(),
          requestSignUp: import_zod.z.boolean().meta({
            description: "Whether to sign up the user if disableImplicitSignUp is enabled"
          }).optional()
        })
      },
      async (ctx) => {
        const frontendOrigin = new URL(
          ctx.request?.url || ctx.context.baseURL
        ).origin;
        const callbackURL = ctx.body.callbackURL || new URL("/", frontendOrigin).toString();
        const email = ctx.body.email || "";
        const errorCallbackURL = ctx.body.errorCallbackURL ? new URL(ctx.body.errorCallbackURL, frontendOrigin).toString() : void 0;
        const requestSignUp = ctx.body.requestSignUp?.toString() || "false";
        const queryParams = new URLSearchParams({
          callbackURL,
          email,
          ...errorCallbackURL ? { errorCallbackURL } : {},
          ...requestSignUp ? { requestSignUp } : {}
        });
        const openidQueryParams = new URLSearchParams({
          "openid.ns": "http://specs.openid.net/auth/2.0",
          "openid.mode": "checkid_setup",
          "openid.realm": frontendOrigin,
          "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.return_to": `${ctx.context.baseURL}/steam/callback?${decodeURIComponent(queryParams.toString())}`
        });
        const openidURL = new URL(
          `/openid/login?${openidQueryParams.toString()}`,
          `https://steamcommunity.com`
        );
        return ctx.json({
          url: openidURL.toString(),
          redirect: !ctx.body.disableRedirect
        });
      }
    ),
    steamCallback: (0, import_api.createAuthEndpoint)(
      "/steam/callback",
      {
        method: "GET",
        query: import_zod.z.object({
          email: import_zod.z.string().meta({ description: "The email to use for the user" }).optional(),
          errorCallbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to if an error occurs"
          }).optional(),
          callbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to after the user is signed in"
          }).optional(),
          newUserCallbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to if the user is new"
          }).optional(),
          requestSignUp: import_zod.z.enum(["true", "false"]).meta({
            description: "Whether to sign up the user if disableImplicitSignUp is enabled"
          }).optional().default("false"),
          linkAccount: import_zod.z.string().meta({
            description: "Flag to indicate this is for account linking"
          }).optional(),
          "openid.ns": import_zod.z.string().meta({
            description: "The namespace of the OpenID request"
          }).optional().default("http://specs.openid.net/auth/2.0"),
          "openid.mode": import_zod.z.string().meta({
            description: "The mode of the OpenID request"
          }).optional().default("id_res"),
          "openid.op_endpoint": import_zod.z.string().meta({
            description: "The OP endpoint of the OpenID request"
          }).optional().default("https://steamcommunity.com/openid/login"),
          "openid.claimed_id": import_zod.z.string().meta({
            description: "The claimed ID of the OpenID request"
          }).optional(),
          "openid.identity": import_zod.z.string().meta({
            description: "The identity of the OpenID request"
          }).optional(),
          "openid.return_to": import_zod.z.string().meta({
            description: "The return to of the OpenID request"
          }).optional(),
          "openid.response_nonce": import_zod.z.string().meta({
            description: "The response nonce of the OpenID request"
          }).optional(),
          "openid.assoc_handle": import_zod.z.string().meta({
            description: "The assoc handle of the OpenID request"
          }).optional(),
          "openid.signed": import_zod.z.string().meta({
            description: "The signed of the OpenID request"
          }).optional(),
          "openid.sig": import_zod.z.string().meta({
            description: "The sig of the OpenID request"
          }).optional()
        }),
        metadata: {
          client: false
        }
      },
      async (ctx) => {
        const baseErrorURL = ctx.context.options.onAPIError?.errorURL || `${ctx.context.baseURL}/error`;
        const baseOrigin = new URL(ctx.context.baseURL).origin;
        if (!ctx?.request?.url) {
          throw ctx.redirect(`${baseErrorURL}?error=missing_request_url`);
        }
        let {
          email,
          callbackURL = `${ctx.context.baseURL}/`,
          errorCallbackURL = baseErrorURL,
          newUserCallbackURL = callbackURL,
          requestSignUp: requestSignUpString,
          linkAccount,
          ...params
        } = ctx.query;
        if (!callbackURL.startsWith("http")) {
          callbackURL = new URL(callbackURL, ctx.context.baseURL).toString();
        }
        if (!errorCallbackURL.startsWith("http")) {
          errorCallbackURL = new URL(
            errorCallbackURL,
            ctx.context.baseURL
          ).toString();
        }
        if (!newUserCallbackURL.startsWith("http")) {
          newUserCallbackURL = new URL(
            newUserCallbackURL,
            ctx.context.baseURL
          ).toString();
        }
        let requestSignUp = requestSignUpString === "true";
        const errorURL = errorCallbackURL || baseErrorURL;
        const trustedOrigins = typeof ctx.context.options.trustedOrigins === "function" ? await ctx.context.options.trustedOrigins(ctx.request) : ctx.context.options.trustedOrigins || [];
        const isMatch = wildcardMatch(trustedOrigins);
        if (!isMatch(new URL(callbackURL).origin)) {
          ctx.context.logger.error(
            `The callback URL provided during sign in with steam is not part of the trusted origins:`,
            callbackURL
          );
          throw ctx.redirect(`${errorURL}?error=callback_url_not_trusted`);
        }
        if (!isMatch(new URL(newUserCallbackURL).origin)) {
          ctx.context.logger.error(
            `The new user callback URL provided during sign in with steam is not part of the trusted origins:`,
            newUserCallbackURL
          );
          throw ctx.redirect(
            `${errorURL}?error=new_user_callback_url_not_trusted`
          );
        }
        if (!isMatch(new URL(errorCallbackURL).origin)) {
          ctx.context.logger.error(
            `The new user callback URL provided during sign in with steam is not part of the trusted origins:`,
            newUserCallbackURL
          );
          throw ctx.redirect(
            `${errorURL}?error=error_callback_url_not_trusted`
          );
        }
        params["openid.mode"] = "check_authentication";
        const verifyRes = await (0, import_fetch.betterFetch)(
          `https://steamcommunity.com/openid/login?${new URLSearchParams(
            params
          ).toString()}`,
          {
            method: "POST"
          }
        );
        if (verifyRes.error) {
          ctx.context.logger.error(
            `Steam OpenID validation failed:`,
            verifyRes.error
          );
          ctx.context.logger.error(
            `An error occurred while verifying the Steam OpenID:`,
            verifyRes.error
          );
          throw ctx.redirect(
            `${errorURL}?error=steam_openid_validation_failed`
          );
        }
        if (!verifyRes.data.includes("is_valid:true")) {
          ctx.context.logger.error(
            `Steam OpenID validation failed:`,
            verifyRes.data
          );
          throw ctx.redirect(
            `${errorURL}?error=steam_openid_validation_failed`
          );
        }
        const steamId = params["openid.claimed_id"]?.split("/").pop();
        if (!steamId) {
          throw ctx.redirect(`${errorURL}?error=steamid_missing`);
        }
        const profileRes = await (0, import_fetch.betterFetch)(
          new URL(
            `ISteamUser/GetPlayerSummaries/v0002/?key=${config.steamApiKey}&steamids=${steamId}`,
            STEAM_BASE_URL
          ).toString()
        );
        if (profileRes.error) {
          ctx.context.logger.error(
            `An error occurred while fetching the Steam profile:`,
            profileRes.error
          );
          throw ctx.redirect(`${errorURL}?error=steam_profile_fetch_failed`);
        }
        const profile = profileRes.data.response.players[0];
        if (!profile) {
          throw ctx.redirect(`${errorURL}?error=steam_profile_not_found`);
        }
        if (linkAccount === "true") {
          const session2 = await (0, import_api.getSessionFromCtx)(ctx);
          if (!session2) {
            throw ctx.redirect(
              `${errorURL}?error=session_required_for_linking`
            );
          }
          const user2 = session2.user;
          const existingAccount = await ctx.context.internalAdapter.findAccount(steamId);
          if (existingAccount) {
            if (existingAccount.userId !== user2.id) {
              throw ctx.redirect(
                `${errorURL}?error=account_already_linked_to_different_user`
              );
            }
            throw ctx.redirect(callbackURL);
          }
          const newAccount = await ctx.context.internalAdapter.createAccount({
            userId: user2.id,
            providerId: "steam",
            accountId: steamId
          });
          if (!newAccount) {
            throw ctx.redirect(`${errorURL}?error=account_creation_failed`);
          }
          if (ctx.context.options.account?.accountLinking?.updateUserInfoOnLink === true) {
            await ctx.context.internalAdapter.updateUser(user2.id, {
              name: profile.realname || user2.name,
              image: profile.avatarfull || user2.image
            });
          }
          throw ctx.redirect(callbackURL || baseOrigin);
        }
        const finalEmail = email || `${steamId}@steam.invalid`;
        const isValidEmail = import_zod.z.string().email().safeParse(finalEmail);
        if (!isValidEmail.success) {
          ctx.context.logger.error(
            `Invalid email during sign in with steam:`,
            isValidEmail.error
          );
          throw ctx.redirect(`${errorURL}?error=invalid_email`);
        }
        let account = await ctx.context.internalAdapter.findAccount(steamId);
        let user = null;
        let isNewUser = false;
        if (!account && (typeof config.disableImplicitSignUp === "boolean" ? config.disableImplicitSignUp && requestSignUp : true)) {
          isNewUser = true;
          const userDetails = await config.mapProfileToUser?.({
            ...profile,
            email: finalEmail
          });
          user = await ctx.context.internalAdapter.createUser({
            ...userDetails || {},
            name: userDetails?.name || profile.realname || "Unknown",
            email: userDetails?.email || finalEmail,
            emailVerified: userDetails?.emailVerified ?? true,
            image: userDetails?.image || profile.avatarfull || ""
          });
          if (!user) {
            ctx.context.logger.error(
              `An error occurred while creating the user during sign in with steam:`,
              userDetails
            );
            throw ctx.redirect(`${errorURL}?error=user_creation_failed`);
          }
          account = await ctx.context.internalAdapter.createAccount({
            accountId: steamId,
            providerId: "steam",
            userId: user.id
          });
          if (!account) {
            ctx.context.logger.error(
              `An error occurred while creating the account during sign in with steam:`,
              userDetails
            );
            throw ctx.redirect(`${errorURL}?error=account_creation_failed`);
          }
        } else if (account) {
          user = await ctx.context.internalAdapter.findUserById(
            account.userId
          );
          if (!user) {
            ctx.context.logger.error(
              `An error occurred while finding the user during sign in with steam:`,
              account
            );
            throw ctx.redirect(`${errorURL}?error=user_not_found`);
          }
        } else {
          throw ctx.redirect(`${errorURL}?error=account_not_found`);
        }
        const session = await ctx.context.internalAdapter.createSession(
          user.id,
          ctx.request
        );
        await (0, import_cookies.setSessionCookie)(ctx, { session, user });
        throw ctx.redirect(
          isNewUser ? newUserCallbackURL || callbackURL || baseOrigin : callbackURL || baseOrigin
        );
      }
    ),
    linkAccountWithSteam: (0, import_api.createAuthEndpoint)(
      "/link-social/steam",
      {
        method: "POST",
        use: [import_api.sessionMiddleware],
        metadata: {
          openapi: {
            description: "Link a Steam account to the current user",
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        url: { type: "string" },
                        redirect: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        body: import_zod.z.object({
          callbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to after the user has linked their account."
          }).optional(),
          errorCallbackURL: import_zod.z.string().meta({
            description: "The URL to redirect to if an error occurs."
          }).optional(),
          disableRedirect: import_zod.z.boolean().meta({ description: "Whether to disable redirect." }).optional()
        })
      },
      async (ctx) => {
        if (config.accountLinking !== true) {
          throw new import_api.APIError("BAD_REQUEST", {
            message: "Account linking is disabled"
          });
        }
        const frontendOrigin = new URL(
          ctx.request?.url || ctx.context.baseURL
        ).origin;
        const callbackURL = ctx.body.callbackURL || `${ctx.context.baseURL}/`;
        const errorCallbackURL = ctx.body.errorCallbackURL || `${ctx.context.baseURL}/error`;
        const queryParams = new URLSearchParams({
          callbackURL,
          errorCallbackURL,
          linkAccount: "true"
          // Flag to indicate this is for account linking
        });
        const openidQueryParams = new URLSearchParams({
          "openid.ns": "http://specs.openid.net/auth/2.0",
          "openid.mode": "checkid_setup",
          "openid.realm": frontendOrigin,
          "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.return_to": `${ctx.context.baseURL}/steam/callback?${decodeURIComponent(queryParams.toString())}`
        });
        const openidURL = new URL(
          `/openid/login?${openidQueryParams.toString()}`,
          `https://steamcommunity.com`
        );
        return ctx.json({
          url: openidURL.toString(),
          redirect: !ctx.body.disableRedirect
        });
      }
    )
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  steam
});
