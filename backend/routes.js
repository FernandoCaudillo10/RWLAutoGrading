const passport = require('passport');
const jwt = require("jsonwebtoken");
const keys = require("./configs/keys");
const bcrypt = require("bcryptjs");
const qry = require('./queries');

//TODO: Fix error messages
class RoutesHandler{
	
	constructor(app){
		this.app = app;

		this.studentRegister = this.studentRegister.bind(this);
		this.studentLogin = this.studentLogin.bind(this);
		this.professorRegister = this.professorRegister.bind(this);
		this.professorLogin = this.professorLogin.bind(this);
		this.studentEvaluateAssignment = this.studentEvaluateAssignment.bind(this);
		this.studentGetAssignment = this.studentGetAssignment.bind(this);
		this.studentGetGrade = this.studentGetGrade.bind(this);
		this.studentSubmitAssignment = this.studentSubmitAssignment.bind(this);
		this.studentAssignmentRubric = this.studentAssignmentRubric.bind(this);
		this.studentSubmitGrade = this.studentSubmitGrade.bind(this);
	}

	studentGetGrade(request,response) {
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) 
				return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) 
					return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			qry.getStudentGrade(pUser.email)
				.then((result) => {
					if(result.rowCount === 0)
						return response.status(400).json({error: "Student email does not have any grades"});
					return response.status(200).json(result.rows);
				})
				.catch(err => {
					console.log(`Student Grade -> ${err}`);
					return response.status(400).json({error: "Server error"});	
				});
			})(request, response);
		}

	studentGetAssignment(request, response) {
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) 
				return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) 
					return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let rID = request.params.rubricID;
			qry.getAssignment(rID)
				.then((result) => {
					if(result.rowCount === 0) 
						return response.status(400).json({error: "No assignment under this ID"});
					return response.status(200).json(result.rows);
				})
				.catch(err => {
					console.log(`Student Assignment -> ${err}`);
					return response.status(400).json({error: "Server error"});	
				});
		})(request, response);
	}

	studentEvaluateAssignment(request, response){
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) 
				return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) 
					return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

		qry.getEvalAssignment(pUser.email)
			.then((result) => {
				if(result.rowCount === 0) 
					return response.status(400).json({error: "No student found under this email"});
				return response.status(200).json(result.rows);		
			})
			.catch(err => {
				console.log(`Student Grade Assignment -> ${err}`);	
				return response.status(400).json({error: "Server error"});
			});			
		})(request, response);
	}
	
	studentSubmitGrade(request, response) {
		passport.authenticate('jwtStudent', {session: false}, async(pError, pUser, info) => {
			console.log("function started");
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
			console.log("user ok");
		
			if(!request.body.assignment)
				return response.status(400).json({error: "Evaluation missing"});

			let assignment = JSON.parse(request.body.assignment);
			let isID = true;
			let isGrade = true;
			console.log(assignment);
			await assignment.evaluation.forEach((e) => {
				if(!e.evaluationID) isID = false;
				if(!e.grade) isGrade = false;
			});

			if(!isID)
				return response.status(400).json({error: "Missing responseID"});
			if(!isGrade) 
				return response.status(400).json({error: "Missing grade"});
			console.log("qry started");
			qry.submitEvalGrade(assignment)
				.then((result) => {
					return response.status(200).json("Success");
				})
				.catch(err => {
					console.log(`Student Grade Evaluation -> ${err}`);	
					return response.status(400).json("Error inserting grade");
				});
		})(request, response);
	}

	studentSubmitAssignment(request, response){
		passport.authenticate('jwtStudent', {session: false}, async(pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
		
		if(!request.body.assignment) 
			return response.status(400).json({error: "Response value missing"});

		let assignment = JSON.parse(request.body.assignment);
		let isResValue = true;
		let isIdValue = true;

		await assignment.responses.forEach((res) => {
			if(!res.response) isResValue = false;
			if(!res.qsID) isIdValue = false;
		});

		if(!isResValue)
			return response.status(400).json({error: "Missing response"});
		if(!isIdValue) 
			return response.status(400).json({error: "Missing question ID"});

		qry.submitAssignment(pUser.email, assignment)
			.then((result) => {
				return response.status(200).json(result);		
			})
			.catch(err => {
				console.log(`Student Submit Assignment -> ${err}`);	
				return response.status(400).json({error: "Server error"});
			});		
		})(request, response);
	}

	studentAssignmentRubric(request, response) {
		passport.authenticate('jwtStudent', {session: false}, async(pError,pUser, info) => {
			if(pError) 
				return response.status(400).json(`${pError}`);	
			
			if(!pUser){
				if(info) 
					return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
			
			let secID = request.params.sectionID;
			qry.takesCheck(pUser.email, secID)
				.then((result) => {	
					if(result.rowCount === 0) 
						return response.status(400).json({error: "Student is not enrolled in section"});		
					qry.getAssignRubric(secID)
						.then((result) => {
							if(result.rowCount === 0) 
								return response.status(400).json({error: "No section under this ID"});
							return response.status(200).json(result.rows);	
						})
						.catch(err => {
							console.log(`Student Takes Check -> ${err}`);	
							return response.status(400).json({error: "Server error"});
						});
				})
				.catch(err => {
					console.log(`Student Takes Check -> ${err}`);	
					return response.status(400).json({error: "Server error"});
				});
		})(request, response);
	}
	
	submitProfEval(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;
			
			let resultClass = await qry.getClass(cId); 
			if(resultClass.rowCount === 0) return response.status(400).json({error: "No class under this id"});
			//TODO: Verify professor can access this class

			let rId = request.params.resId;
			
			let resultResponse = await qry.getStudentResponse(rId); 
			if(resultResponse.rowCount === 0) return response.status(400).json({error: "No student response under this id"});
			
			if(!request.body.grade) return response.status(400).json({error: "No grade in body"});
			let grade = request.body.grade;
			
			
			let profEval = await qry.createProfEval(pUser.email, rId, grade);
			if(profEval.rowCount === 0) return response.status(400).json({error: "Server erro"});

			return response.status(400).json(profEval.rows);

		})(request, response);
	}

	getAssignment(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			let cId = request.params.classId;
			//TODO: Verify professor can access this class

			let rId = request.params.rubId;
			
			qry.getAssignment(rId)
				.then((result) => {
					return response.status(200).json(result.rows);
				});

		})(request, response);
	}

	deleteAssignment(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}
			
			let cId = request.params.classId;
			//TODO: Verify professor can access this class

			let rId = request.params.rubId;
			qry.deleteRubric(rId)
				.then(() => {return response.status(200).json({error: "Rubric successfully deleted"})})
				.catch(err => {
					console.log(`Class Assignments -> ${err}`);
					return response.status(400).json({error: "Server error"});
				});

		})(request, response);
	}

	createAssignment(request, response){
		passport.authenticate('jwtProfessor', {session: false},
			async (pError, pUser, info) => {
			if(pError) return response.status(400).json(`${pError}`);

			if(!pUser){
				if(info) return response.status(400).json({error: info});
				return response.status(400).json({error: "No user under this email"});
			}

			//TODO: Verify professor can access this class
			let cId = request.params.classId;
			
			//TODO: Add checking for if dates are before today and all dates are after eachother
			let assigned_date = request.body.assigned_date;
			let due_date = request.body.due_date;
			let final_due_date = request.body.final_due_date;
			
			if(!request.body.assignment) return response.status(400).json({error: "Assignment is missing"});
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
							cl.section_id = result.rows[0].section_id;
							return response.status(200).json(cl);
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
