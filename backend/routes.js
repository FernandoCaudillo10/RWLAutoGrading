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

	createAssignment(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;

			let assigned_date = Math.floor(Date.now() / 1000);
			let due_date = Math.floor(Date.now() / 1000);
			let final_due_date = Math.floor(Date.now() / 1000);

			let assignment = JSON.parse(request.body.assignment);
			if(!assignment.prompts) return response.status(400).json({error: "No prompts in assignment"});
			
			let validPrompt = true;
			let validQuest = true;
			await assignment.prompts.forEach((prompt) => {
					if(!prompt.questions || !prompt.prompt) validPrompt = false;
					else{
						prompt.questions.forEach((q) => {
							if(!q.question || !q.min_char) validQuest = false;
						});
					}
				});
			if(!validPrompt) return response.status(400).json({error: "Missing questions or prompt in Prompts"});
			if(!validQuest) return response.status(400).json({error: "Missing question or min_char in Questions"});

			let resultRubric = await qry.createRubric(assigned_date, due_date, final_due_date, assignment)

			let resultSections = await qry.getClassSections(cId)
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

			if(resultRubric.rowCount === 0) return response.status(400).json({error: "Server Error"});
			if(resultSections.rowCount === 0) return response.status(400).json({error: "No class under this id"});
			
			let rub_id = resultRubric.rows[0].rubric_id;
			resultSections.rows.forEach((row) => {
				qry.connectSectionRubric(row.section_id, rub_id);
			});
			return response.status(200).json(resultRubric.rows[0]);

		})(request, response);
	}

	classAssignments(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;
			qry.getClass(cId)
				.then((result) => {
					if(result.rowCount === 0) return response.status(400).json({error: "No class under this id"});
					
					let cl = result.rows[0];
					if(pUser.email != cl.professor_email) return response.status(400).json({error: "Professor unathorized"});

					qry.getAllClassAssignments(cl.class_id)
					.then(result => {
						return response.status(200).json(result.rows);
					});
				})
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

		})(request, response);
	}
	
	createClass(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cName = request.body.name;
			qry.createClass(pUser.email, cName)
				.then((result) => {
					if(result.rowCount === 0) return response.status(400).json({error: "No class under this id"});
					
					let cl = result.rows[0];

					qry.createSection(cl.class_id)
						.then(result => {
							return response.status(200).json(result.rows);
						});
				})
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

		})(request, response);
	}

	getClassSections(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;
			qry.getClassSections(cId)
				.then((result) => {
					if(result.rowCount === 0) return response.status(400).json({error: "No class under this id"});

					return response.status(200).json(result.rows);
				})
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

		})(request, response);
	}
	createSection(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;
			qry.getClass(cId)
				.then((result) => {
					if(result.rowCount === 0) return response.status(400).json({error: "No class under this id"});
					
					let cl = result.rows[0];
					if(pUser.email != cl.professor_email) return response.status(400).json({error: "Professor unathorized"});

					qry.createSection(cl.class_id)
					.then(result => {
							return response.status(200).json(result.rows);
					});
				})
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

		})(request, response);
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
