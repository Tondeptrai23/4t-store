import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import UserService from "../../services/user.service.js";
import { generate } from "generate-password";

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL,
	passReqToCallback: true
},
	async function (request, accessToken, refreshToken, profile, done) {
		try {
			const user = await UserService.findByEmail(profile.email);
			if (user) { return done(null, user); }

			const newUser = await UserService.create({
				name: profile.displayName,
				email: profile.email,
				password: generate({
					length: 10,
					numbers: true,
				}),
				role: "user",
			});
			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
	}
));