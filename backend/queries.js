const {Pool} = require('pg')
const bcrypt = require("bcryptjs");

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://postgres:postgres@localhost:5432/rwlDB';

const pool = new Pool({
	connectionString: connString,
	ssl:true,
})
function getClassSections(class_id){
	return pool.query(`SELECT * FROM class c JOIN section s ON c.class_id=s.class_id WHERE c.class_id='${class_id}'`);
}
function getClass(class_id){
	return pool.query(`SELECT * FROM class WHERE class.class_id='${class_id}'`);
}
function getAllClassAssignments(class_id){
	return pool.query(`SELECT * FROM section s JOIN section_rubric sr ON s.section_id=sr.section_id JOIN rubric r ON sr.rubric_id=r.rubric_id WHERE s.class_id='${class_id}'`);
}
function createClass(email, name){
	return pool.query(`INSERT INTO class(professor_email, name) VALUES ('${email}','${name}') RETURNING *`);
}
function createSection(class_id){
	return pool.query(`INSERT INTO section(class_id) VALUES ('${class_id}') RETURNING *`);
}

function getStudByEmail(email){
	return pool.query(`SELECT * FROM student WHERE student.email='${email}'`);
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
	getStudByEmail,
	addStudent,
	getProfByEmail,
	addProfessor,
	updateProfessor,
	updateStudent,
	getClassSections,
	getClass,
	getAllClassAssignments,
	createClass,
	createSection,
}
