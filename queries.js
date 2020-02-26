const {Pool} = require('pg')
const pool = new Pool({
	user: "me",
 	password: "password",
 	host: "localhost",
 	port: 5432,
    database: "api",
})

const getUsers = (request, response) => {
	pool.query('SELECT name FROM users', (error, results) => {
		if(error) { throw error }
		response.status(200).json(results.rows)
	})
}

module.exports = {
	getUsers,
}
