const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("./configs/keys");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const qry = require('./queries');

opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

function useJWT(passport){
	passport.use('jwtStudent',
		new JwtStrategy(opts, 
			async (jwt_payload, done) => {
				console.log("in jwt")
				try{
					 await qry.getStudByEmail(jwt_payload.email)
							.then((result) => {
								if(result.rowCount === 0){
									return done(null, false,{ message: 'No account under this email' });
								}
								else if(result.rowCount > 1){
									return done(null, false,{ message: 'Unknown error' });
								}
								let user = result.rows[0];
								return done(null, user);
							})
							.catch(err => {
								console.log(`passport error-> ${err}`);
								return done("Server error");
							});
				} catch (err) {
					console.log(err);
					done(new Error("server error"));
				}
			})
		);
	passport.use('jwtProfessor',
		new JwtStrategy(opts, 
			async (jwt_payload, done) => {
				try{
					 await qry.getProfByEmail(jwt_payload.email)
							.then((result) => {
								if(result.rowCount === 0){
									return done(null, false,{ message: 'No account under this email' });
								}
								else if(result.rowCount > 1){
									return done(null, false,{ message: 'Unknown error' });
								}
								let user = result.rows[0];
								return done(null, user);
							})
							.catch(err => {
								console.log(`passport error-> ${err}`);
								return done("Server error");
							});
				} catch (err) {
					console.log(err);
					done(new Error("server error"));
				}
			})
		);
}

function useStudPassport(passport){
	passport.use(
	  'studentLogin',
	  new localStrategy(
		{
		  usernameField: 'email',
		  passwordField: 'password',
		  session: false,
		},
		async (email, password, done) => {
			 await qry.getStudByEmail(email)
					.then((result) => {
						if(result.rowCount === 0){
							return done(null, false,{ message: 'No account under this email' });
						}
						else if(result.rowCount > 1){
							return done(null, false,{ message: 'Unknown error' });
						}
						let user = result.rows[0];
						bcrypt.compare(password, user.password)
							.then(isMatch => {
							  if (isMatch) {
								return done(null, user);
							  } else {
								return done(null, false,{ message: 'Incorrect password' });
							  }
							});
					})
					.catch(err => {
						console.log(`passport error-> ${err}`);
						return done("Server error");
					});
		},
	  ),
	);

	passport.use(
	  'studentRegister',
	  new localStrategy(
		{
		  usernameField: 'email',
		  passwordField: 'password',
		  session: false,
		},
		async (email, password, done) => {
			 await qry.getStudByEmail(email)
					.then((result) => {
						if(result.rowCount > 0){
							return done(new Error("Email already exists"), false);
						}
						qry.addStudent("", email, password)
							.then( (result) => {
								return done(null, result.rows[0]);
							})
							.catch( (error) => {
								console.log("Error: Add Student");
								console.log(`-----> ${error}`);
							});
					})
					.catch(err => {
						console.log(`passport error-> ${err}`);
						return done(new Error("Server error"));
					});
		},
	  ),
	);
}

function useProfPassport(passport){
	passport.use(
	  'professorLogin',
	  new localStrategy(
		{
		  usernameField: 'email',
		  passwordField: 'password',
		  session: false,
		},
		async (email, password, done) => {
			 await qry.getProfByEmail(email)
					.then((result) => {
						if(result.rowCount === 0){
							return done(null, false,{ message: 'No account under this email' });
						}
						else if(result.rowCount > 1){
							return done(null, false,{ message: 'Unknown error' });
						}
						let user = result.rows[0];
						bcrypt.compare(password, user.password)
							.then(isMatch => {
							  if (isMatch) {
								return done(null, user);
							  } else {
								return done(null, false,{ message: 'Incorrect password' });
							  }
							});
					})
					.catch(err => {
						console.log(`passport error-> ${err}`);
						return done("Server error");
					});
		},
	  ),
	);

	passport.use(
	  'professorRegister',
	  new localStrategy(
		{
		  usernameField: 'email',
		  passwordField: 'password',
		  session: false,
		},
		async (email, password, done) => {
			 await qry.getProfByEmail(email)
					.then((result) => {
						if(result.rowCount > 0){
							return done(new Error("Email already exists"), false);
						}
						qry.addProfessor("", email, password)
							.then( (result) => {
								return done(null, result.rows[0]);
							})
							.catch( (error) => {
								console.log("Error: Add Student");
								console.log(`-----> ${error}`);
							});
					})
					.catch(err => {
						console.log(`passport error-> ${err}`);
						return done(new Error("Server error"));
					});
		},
	  ),
	);
}

module.exports = { useJWT: useJWT, useStudPassport: useStudPassport, useProfPassport: useProfPassport};
