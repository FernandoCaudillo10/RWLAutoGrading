const passport = require('passport');
const jwt = require("jsonwebtoken");
const keys = require("./configs/keys");
const bcrypt = require("bcryptjs");
const qry = require('./queries');

class RoutesHandler{
	
	constructor(app){
		this.app = app;

		this.studentRegister = this.studentRegister.bind(this);
		this.studentLogin = this.studentLogin.bind(this);
		this.professorRegister = this.professorRegister.bind(this);
		this.professorLogin = this.professorLogin.bind(this);
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
				qry.updateProfessor(request.body.name, pUser.email)
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
				qry.updateStudent(request.body.name, pUser.email)
				.then(() => response.status(200).send({message: 'user created successfully'}))
				.catch(err => {
					console.log(`Error: Student Register\n----> ${err}`);
					response.status(400).json(`${err}`);
					});
			});
		})(request, response);
	}
	professorUpdate(request, response, next){
		passport.authenticate('jwtStudent', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				return response.status(400).json({error: "No user under this email"});
			}
			let rUser = request.body;
			if(rUser){
				let r;
				if(rUser.password && rUser.name){
					await qry.updateProfessor(rUser.name, rUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Erro: Update professor\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.name){
					await qry.updateProfessor(rUser.name, rUser.email)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Professor Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.password){
					await qry.updateProfessor(null, rUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Professor Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else return response.status(400).json({error: "server error"});

				return r;
			}
			else return response.status(400).json({error: "No user in request"});
		})(request, response, next);
	}

	studentUpdate(request, response, next){
		passport.authenticate('jwtStudent', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				return response.status(400).json({error: "No user under this email"});
			}
			let rUser = request.body;
			if(rUser){
				let r;
				if(rUser.password && rUser.name){
					await qry.updateStudent(rUser.name, rUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Erro: Update student\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.name){
					await qry.updateStudent(rUser.name, rUser.email)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Student Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.password){
					await qry.updateStudent(null, rUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Student Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else return response.status(400).json({error: "server error"});

				return r;
			}
			else return response.status(400).json({error: "No user in request"});
		})(request, response, next);
	}
}

module.exports = {
	RoutesHandler,
}
