import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import UserService from "../../services/user.service.js";
import { generate } from "generate-password";
import api from "../../config/api.js";

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL,
	passReqToCallback: true
},
	async function (request, accessToken, refreshToken, profile, done) {
		try {
			if (!profile.email) { return done(null, false); }
			let user = await UserService.findByEmail(profile.email);
			if (!user) {
				const generatedPassword = generate({
					length: 10,
					numbers: true,
				});

				const res = await api.post(`/register`, {
					username: profile.email,
					password: Buffer.from('hidden_' + profile.email).toString('base64'),
				});

				const newUser = await UserService.create({
					name: profile.displayName,
					email: profile.email,
					password: generatedPassword,
					role: "user",
				});
				user = newUser;
			}

			const res = await api.post(`/login`, {
				username: user.dataValues.email,
				password: Buffer.from('hidden_' + user.dataValues.email).toString('base64'),
			});

			const { password: passwordUser, ...userWithoutPassword } = user.dataValues;

			return done(null, {
				...userWithoutPassword,
				paymentToken: res.data.token,
			});
		} catch (error) {
			return done(error, null);
		}
	}
));