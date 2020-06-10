const {Pool} = require('pg');
const bcrypt = require("bcryptjs");

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});

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
            bcrypt.genSalt(10, (err, salt) => {                                                                                                                                                     bcrypt.hash(password, salt, (err, hash) => {
                    if(err) onFail(err);
                    pool.query(`UPDATE student SET password='${hash}' WHERE email='${email}'`)
                        .then(result => onSuccess(result))                                                                                                                                                  .catch((error) => { onFail(error)} );                                                                                                                                       });
            });
        });
    }
    return new Promise( (onSuccess, onFail) => {
        pool.query(`UPDATE student SET name='${name}' WHERE email='${email}'`)
            .then(result => onSuccess(result))
            .catch((error) => { onFail(error)} );
    });
}

function getStudByEmail(email){
    return pool.query(`SELECT * FROM student WHERE student.email='${email}'`);
}

module.exports = {
		addStudent,
		updateStudent,
		getStudByEmail,
}
