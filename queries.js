const {Pool} = require('pg')
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
	connectionString: connString,
	ssl:true,
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
