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
		this.studentGradeAssignment = this.studentGradeAssignment.bind(this);
	}

	studentGradeAssignment(request, response){
		console.log("grading assign");
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) 
					return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
		console.log("user authenticated");
		qry.gradeAssignment(pUser.email)
			.then((result) => {
				if(result.rowCount === 0) 
					return response.status(400).json({error: "No student found under this email"});
				console.log("qry returned");
				return response.status(200).json(result.rows);		
			})
			.catch(err => {
				console.log(`Student Grade Assignment -> ${err}`);	
				return response.status(400).json({error: "Server error"});
			});			
		})(request, response);
	}
/*
	studentSubmitAssignment(request, response){
		console.log("submitting ass");
		passport.authenticate('jwtStudent', {session: false}, async(pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
		
		let qsID = request.params.questionID;

		if(!request.body.responseValue) return response.status(400).json({error: "Response value missing"});
		let resValue = JSON.parse(request.body.responseValue);

		qry.gradeAssignment(pUser.email, qsID, resValue)
			.then((result) => {
				if(result.rowCount === 0) return response.status(400).json({error: "No question found under this ID"});
				return response.status(200).json(results.rows);		
			})
			.catch(err => {
				//console.log(`Student Submit Assignment` -> `${err}`);	
				return response.status(400).json({error: "Server error"});
			});		
		})(request, response);
	}

	studentAssignmentRubric(request, response) {
		console.log("function hit");
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			console.log("authentication");
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
			console.log("User ok");
			let secID = request.params.sectionID;
			qry.takesCheck(pUser.email, secID)
				.then((result) => {	
					if(result.rowCount === 0) return response.status(400).json({error: "Student is not enrolled in section"});		
					console.log("1st qry hit");
					qry.getAssignRubric(secID)
						.then((result) => {
							if(result.rowCount === 0) return response.status(400).json({error: "No section under this ID"});
							concole.log("2nd query hit");
							return response.status(200).json(results.rows);	
						})
						.catch(err => {
						//console.log(`Student Assignment Rubric` -> `${err}`);	
							return response.status(400).json({error: "Server error"});
						});
				})
				.catch(err => {
					//console.log(`Student Takes Check` -> `${err}`);	
					return response.status(400).json({error: "Server error"});
				});
		})(request, response);
	}

	studentAssignment(request, response) {
		console.log("stud ass hit");
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
			console.log("user okay");
			let rID = request.params.rubricID;
			qry.getAssignment(rID)
				.then((result) => {
					if(result.rowCount() === 0) return response.status(400).json({error: "No assignment under this ID"});
					console.log("qry hit");
					return reponse.status(200).json(result.rows);
				})
				.catch(err => {
				//	console.log(`Student Assignment` -> `${error}`);
					return response.status(400).json({error: "Server error"});	
				});
		})(request, response);
	}
*/
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
			  type: "prof"
			};
			// Sign token
			jwt.sign(
			  payload,
			  keys.secretOrKey,
			  {
				expiresIn: 604800 * 4 // 4 week in seconds
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
			  type: "stud",
			};
			// Sign token
			jwt.sign(
			  payload,
			  keys.secretOrKey,
			  {
				expiresIn: 604800 * 4 // 4 week in seconds
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
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let rUser = request.body;

			if(rUser){
				let r;
				if(rUser.password && rUser.name){
					await qry.updateProfessor(rUser.name, pUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Erro: Update professor\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.name){
					await qry.updateProfessor(rUser.name, pUser.email)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Professor Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.password){
					await qry.updateProfessor(null, pUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Professor Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else return response.status(400).json({error: "Missing password or name to update"});

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
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let rUser = request.body;
			if(rUser){
				let r;
				if(rUser.password && rUser.name){
					await qry.updateStudent(rUser.name, pUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Erro: Update student\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.name){
					await qry.updateStudent(rUser.name, pUser.email)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Student Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else if(rUser.password){
					await qry.updateStudent(null, pUser.email, rUser.password)
					.then(() => r = response.status(200).send({message: 'user updated successfully'}))
					.catch(err => {
						console.log(`Error: Student Update\n----> ${err}`);
						r = response.status(400).json(`${err}`);
					});
				}
				else return response.status(400).json({error: "Missing password or name to update"});

				return r;
			}
			else return response.status(400).json({error: "No user in request"});
		})(request, response, next);
	}
}

module.exports = {
	RoutesHandler,
}
