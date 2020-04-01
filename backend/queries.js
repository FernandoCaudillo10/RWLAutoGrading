const {Pool} = require('pg')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./configs/keys");
const validateRegisterInput = require("./helpers/register");
const validateLoginInput = require("./helpers/login");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://postgres:postgres@localhost:5432/rwlDB';
const pool = new Pool({
	connectionString: connString,
	ssl:true,
})

function getUserByEmail(email){
	return pool.query(`SELECT * FROM student WHERE student.email='${email}'`);
}

function addStudent(name, email, password){
	return new Promise( (onSuccess, onFail) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if(err) onFail(err);
				pool.query(`INSERT INTO student(name, email, password, date) VALUES ('${name}', '${email}', '${hash}', NOW())`)
					.then( () =>{
						getUserByEmail(email).then((result) => onSuccess(result));
					})
					.catch((error) => { onFail(error)} );
			});
		});
	});
}

function getProfByEmail(email){
	return pool.query(`SELECT * FROM professor WHERE professor.email='${email}'`);
}

function addProfessor(name, email, password){
	return new Promise( (onSuccess, onFail) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if(err) onFail(err);
				pool.query(`INSERT INTO professor(name, email, password, date) VALUES ('${name}', '${email}', '${hash}', NOW())`)
					.then( () =>{
						getProfByEmail(email).then((result) => onSuccess(result));
					})
					.catch((error) => { onFail(error)} );
			});
		});
	});
}


function updateProfessor(name, email, password){
	if(password){
		return new Promise( (onSuccess, onFail) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if(err) onFail(err);
					pool.query(`UPDATE professor SET name='${name}', password='${hash}' WHERE email='${email}'`)
						.then(result => onSuccess(result))
						.catch((error) => { onFail(error)} );
				});
			});
		});
	}
	return new Promise( (onSuccess, onFail) => {
		pool.query(`UPDATE professor SET name='${name}' WHERE email='${email}'`)
			.then(result => onSuccess(result))
			.catch((error) => { onFail(error)} );
	});
}
function updateStudent(name, email, password){
	if(password){
		return new Promise( (onSuccess, onFail) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if(err) onFail(err);
					pool.query(`UPDATE student SET name='${name}', password='${hash}' WHERE email='${email}'`)
						.then(result => onSuccess(result))
						.catch((error) => { onFail(error)} );
				});
			});
		});
	}
	return new Promise( (onSuccess, onFail) => {
		pool.query(`UPDATE student SET name='${name}' WHERE email='${email}'`)
			.then(result => onSuccess(result))
			.catch((error) => { onFail(error)} );
	});
}

class DatabaseHandler{
	
	constructor(app){
		this.app = app;

		this.opts = {};
		this.opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
		this.opts.secretOrKey = keys.secretOrKey;

		this.studentRegister = this.studentRegister.bind(this);
		this.studentLogin = this.studentLogin.bind(this);
		this.professorRegister = this.professorRegister.bind(this);
		this.professorLogin = this.professorLogin.bind(this);
	}
	
	listen(){
		// Put all API endpoints under '/api'
	}

	useStudPassport(passport){
		passport.use(
		  'studentLogin',
		  new localStrategy(
			{
			  usernameField: 'email',
			  passwordField: 'password',
			  session: false,
			},
			async (email, password, done) => {
				 await getUserByEmail(email)
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
				 await getUserByEmail(email)
						.then((result) => {
							if(result.rowCount > 0){
								return done(new Error("Email already exists"), false);
							}
							addStudent("", email, password)
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

	useProfPassport(passport){
		passport.use(
		  'professorLogin',
		  new localStrategy(
			{
			  usernameField: 'email',
			  passwordField: 'password',
			  session: false,
			},
			async (email, password, done) => {
				 await getProfByEmail(email)
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
				 await getProfByEmail(email)
						.then((result) => {
							if(result.rowCount > 0){
								return done(new Error("Email already exists"), false);
							}
							addProfessor("", email, password)
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

	professorLogin(request, response){
		passport.authenticate('professorLogin', (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${err}`);

			if (info != undefined) {
				console.log(info.message);
				response.send(info.message);
			}
			// User matched
			// Create JWT Payload
			const payload = {
			  email: pUser.email,
			};
			// Sign token
			jwt.sign(
			  payload,
			  keys.secretOrKey,
			  {
				expiresIn: 31556926 // 1 year in seconds
			  },
			  (err, token) => {
				if(err) throw err;
				response.status(200).json({
				  success: true,
				  token: "Bearer " + token
				});
			  }
			);
		})(request, response);
	}

	professorRegister(request, response) {
		passport.authenticate('professorRegister', (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if (info != undefined) {
				console.log(info.message);
				return response.send(info.message);
			}

			request.logIn(pUser, err => {
				updateProfessor(request.body.name, pUser.email)
				.then(() => response.status(200).send({message: 'user created successfully'}))
				.catch(err => {
					console.log(`Erro: LogIn\n----> ${err}`);
					response.status(400).json(`${err}`);
					});
			});
		})(request, response);
	}

	studentLogin(request, response){
		passport.authenticate('studentLogin', (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${err}`);

			if (info != undefined) {
				console.log(info.message);
				response.send(info.message);
			}
			// User matched
			// Create JWT Payload
			const payload = {
			  email: pUser.email,
			};
			// Sign token
			jwt.sign(
			  payload,
			  keys.secretOrKey,
			  {
				expiresIn: 31556926 // 1 year in seconds
			  },
			  (err, token) => {
				if(err) throw err;
				response.status(200).json({
				  success: true,
				  token: "Bearer " + token
				});
			  }
			);
		})(request, response);
	}

	studentRegister(request, response) {
		passport.authenticate('studentRegister', (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if (info != undefined) {
				console.log(info.message);
				return response.send(info.message);
			}

			request.logIn(pUser, err => {
				updateStudent(request.body.name, pUser.email)
				.then(() => response.status(200).send({message: 'user created successfully'}))
				.catch(err => {
					console.log(`Erro: LogIn\n----> ${err}`);
					response.status(400).json(`${err}`);
					});
			});
		})(request, response);
	}
}

module.exports = {
	DatabaseHandler,
}
