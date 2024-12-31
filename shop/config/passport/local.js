import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
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
		if (!user) {
			return done(new Error("The username or the password is incorrect"), false);
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return done(new Error("The username or the password is incorrect"), false);
		}
		return done(null, user);
	} catch (error) {
		return done(error, null);
	}
}));