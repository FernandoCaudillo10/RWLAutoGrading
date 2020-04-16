const {Pool} = require('pg')
const bcrypt = require("bcryptjs");

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
	connectionString: connString,
	ssl:true,
})

function getStudentGrade(email){
	return pool.query(`SELECT SUM(response_grade)/COUNT(*) AS total FROM takes JOIN rubric ON rubric.section_id=takes.section_id JOIN prompt ON prompt.rubric_id=rubric.rubric_id JOIN question ON prompt.prompt_id=question.prompt_id JOIN response ON response.question_id=question.question_id JOIN evaluation ON evaluation.response_id=response.response_id WHERE student_id='${email}'`);

}
function getStudByEmail(email){
	return pool.query(`SELECT * FROM student WHERE student.email='${email}'`);
}

function takesCheck(email, sectionID){
	return pool.query(`SELECT student_id FROM takes WHERE student_id='${email}' AND section_id='${sectionID}'`);
}

function getAssignRubric(sectionID){
	return pool.query(`SELECT * FROM rubric WHERE rubric.section_id='${sectionID}' AND rubric.due_date >= NOW()`);
}

function getAssignment(rubricID){		
	return pool.query(`SELECT prompt.prompt_id, prompt_text, question_text, min_char FROM prompt INNER JOIN question ON prompt.rubric_id='${rubricID}' AND prompt.prompt_id=question.prompt_id`);
}

function getEvalAssignment(email){
	return pool.query(`SELECT evaluation_id, prompt_text, question_id, question_text, response_id, response_value FROM evaluation INNER JOIN response ON evaluation.student_email='${email}' AND evaluation.response_id=response.response_id INNER JOIN question ON response.question_id=question.question_id INNER JOIN prompt ON question.prompt_id=prompt.prompt_id`);
}

async function submitAssignment(email, assignment){
	var data = [];

	let result = await assignment.responses.forEach(async (res) => {
		return await pool.query(`INSERT INTO response (response_id, student_email, response_value, question_id) VALUES (DEFAULT, '${email}', '${res.response}', '${res.qsID}') RETURNING *`)
		.then(() => {
			console.log(result);
			data.push(result)
		});
	});
	return data;
}

async function submitEvalGrade(assignment){
	let result = await assignment.evaluation.forEach((eval) => {
		return pool.query(`UPDATE evaluation SET response_grade='${eval.grade}' WHERE eval_id='${eval.evaluationID}' RETURNING *`);
	});
	return result;
}

function addStudent(name, email, password){
	return new Promise( (onSuccess, onFail) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if(err) onFail(err);
				pool.query(`INSERT INTO student(name, email, password, date) VALUES ('${name}', '${email}', '${hash}', NOW())`)
					.then( () =>{
						getStudByEmail(email).then((result) => onSuccess(result));
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
	if(!email) return new Error("Server Error");

	if(password && name){
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
	if(password){
		return new Promise( (onSuccess, onFail) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if(err) onFail(err);
					pool.query(`UPDATE student SET password='${hash}' WHERE email='${email}'`)
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

module.exports = {
	takesCheck,
	submitEvalGrade,
	getEvalAssignment,
	submitAssignment,
	getAssignRubric,
	getAssignment,
	getStudByEmail,
	getStudentGrade,
	addStudent,
	getProfByEmail,
	addProfessor,
	updateProfessor,
	updateStudent,
}
