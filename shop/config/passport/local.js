import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserService from "../../services/user.service.js";

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.findById(id);
    if (!user) { throw new Error("User not found"); }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

export default passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
}, async (username, password, done) => {
  try {
    const user = await UserService.findByEmail(username);
    if (!user) { throw new Error("User not found"); }
    if (user.password !== password) { throw new Error("Password is incorrect"); }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));