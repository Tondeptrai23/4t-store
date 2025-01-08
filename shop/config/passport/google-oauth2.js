import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import UserService from "../../services/user.service.js";

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL,
	passReqToCallback: true
},
	async function (request, accessToken, refreshToken, profile, done) {
		try {
			const user = await UserService.findByEmail(profile.email);
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		} catch (error) {
			return done(error, null);
		}
	}
));