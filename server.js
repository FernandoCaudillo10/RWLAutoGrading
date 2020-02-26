const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 8080;
const db = require('./queries')

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
/*
app.get('/api/example', (req, res) => {});
*/
app.get('/testDB', db.getUsers)
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
