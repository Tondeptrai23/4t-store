import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import api, { generateToken } from "../../config/api.js";
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
                if (!profile.emails) {
                    return done(null, false);
                }
                let user = await UserService.findByEmail(
                    profile.emails[0]?.value
                );
                if (!user) {
                    const res = await api.post(
                        `/register`,
                        {
                            username: profile.emails[0]?.value,
                        },
                        {
                            headers: {
                                "x-server-token": generateToken(),
                            },
                        }
                    );

                    const newUser = await UserService.create({
                        name: profile.displayName,
                        email: profile.emails[0]?.value,
                        password: Buffer.from(
                            "hiddehiddenfacebook_n_" + profile.emails[0]?.value
                        ).toString("base64"),
                        role: "user",
                        provider: "facebook",
                    });
                    user = newUser;
                }

                if (user.provider !== "facebook") {
                    done(null, false);
                }

                const res = await api.post(
                    `/login`,
                    {
                        username: user.dataValues.email,
                    },
                    {
                        headers: {
                            "x-server-token": generateToken(),
                        },
                    }
                );

                const { password: passwordUser, ...userWithoutPassword } =
                    user.dataValues;

                return done(null, {
                    ...userWithoutPassword,
                    paymentToken: res.data.token,
                });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
