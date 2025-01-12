import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import api from "../../config/api.js";
import UserService from "../../services/user.service.js";
import { DeserializeError } from "../../utils/errors.js";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    try {
        const existingUser = await UserService.findById(user.userId);
        if (!existingUser) {
            return done(new DeserializeError("User not found"), null);
        }

        const { password, ...userWithoutPassword } = JSON.parse(
            JSON.stringify(existingUser)
        );

        return done(null, {
            ...userWithoutPassword,
            paymentToken: user.paymentToken,
        });
    } catch (error) {
        return done(new DeserializeError(error), null);
    }
});

export default passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await UserService.findByEmail(username);
                if (!user) {
                    return done(null, false);
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false);
                }

                const res = await api.post(`/login`, {
                    username: username,
                    password: password,
                });

                const { password: passwordUser, ...userWithoutPassword } =
                    JSON.parse(JSON.stringify(user));

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
