const {Pool} = require('pg');
const bcrypt = require("bcryptjs");

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});

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

function getProfByEmail(email){
    return pool.query(`SELECT * FROM professor WHERE professor.email='${email}'`);
}

module.exports = {
		updateProfessor,
		addProfessor,
		getProfByEmail,
}
