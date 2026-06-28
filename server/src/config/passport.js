import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "./env.js";
import { authService } from "../modules/auth/services/auth.service.js";

if (env.googleClientId && env.googleClientSecret && env.googleCallbackUrl) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const user = await authService.handleOAuthUser({
            provider: "google",
            providerId: profile.id,
            email,
            name: profile.displayName ?? "Google User",
            avatarUrl: profile.photos?.[0]?.value
          });
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

if (env.githubClientId && env.githubClientSecret && env.githubCallbackUrl) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.githubClientId,
        clientSecret: env.githubClientSecret,
        callbackURL: env.githubCallbackUrl,
        scope: ["user:email"]
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const primaryEmail = profile.emails?.[0]?.value ?? `${profile.username}@users.noreply.github.com`;
          const user = await authService.handleOAuthUser({
            provider: "github",
            providerId: profile.id,
            email: primaryEmail,
            name: profile.displayName || profile.username || "GitHub User",
            avatarUrl: profile.photos?.[0]?.value
          });
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
