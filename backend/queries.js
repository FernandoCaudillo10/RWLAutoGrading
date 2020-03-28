const {Pool} = require('pg')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const keys = require("./config/keys");
const validateRegisterInput = require("./helpers/register");
const validateLoginInput = require("./helpers/login");

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://postgres:postgres@localhost:5432/rwlDB';
const pool = new Pool({
	connectionString: connString,
	ssl:true,
})

class DatabaseHandler{
	
	constructor(app){
		this.app = app;
		this.studentRegister = this.studentRegister.bind(this);
		this.getUserByEmail = this.getUserByEmail.bind(this);
	}
	
	listen(){
		// Put all API endpoints under '/api'
		this.app.post('/api/stud/cred/register', this.studentRegister);
	}
	
	getUserByEmail(email){
		return pool.query(`SELECT * FROM student WHERE student.email='${email}'`);
	}

	addStudent(name, email, password){
		return new Promise( (onSuccess, onFail) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					console.log("here");
					if(err) onFail(err);
					pool.query(`INSERT INTO student(name, email, password, date) VALUES ('${name}', '${email}', '${hash}', NOW())`)
						.then(onSuccess)
						.catch((error) => { onFail(error)} );
				});
			});
		});
	}

	studentRegister(request, response) {
		const {errors, isValid} = validateRegisterInput(request.body);
		if (!isValid) {
			  return response.status(400).json(errors);
		}

		this.getUserByEmail(request.body.email)
			.then((result) => {
				if(result.rowCount !== 0){
					throw new Error("Email already exists");
				}
				this.addStudent(request.body.name, request.body.email, request.body.password)
					.then( () => {
						response.status(200).send();
					})
					.catch( (error) => {
						console.log("Error: Add Student");
						console.log(`-----> ${error}`);
					});
			})
			.catch((err) => { 
				console.log("Error: Student Register");
				console.log(`-----> ${err}`);
				return response.status(400).json(`${err}`);
			});
	}
}

module.exports = {
	DatabaseHandler,
}
