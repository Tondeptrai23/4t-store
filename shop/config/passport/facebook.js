import { generate } from "generate-password";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserService from "../../services/user.service.js";

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["email", "id", "displayName"],
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                const user = await UserService.findByEmail(
                    profile.emails[0]?.value
                );
                if (user) {
                    return done(null, user);
                }

                const newUser = await UserService.create({
                    name: profile.displayName,
                    email: profile.emails[0]?.value,
                    password: generate({
                        length: 10,
                        numbers: true,
                    }),
                    role: "user",
                });
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
