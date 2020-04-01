const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 8080;
const db = require('./backend/queries')
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Database handler to make api endpoints modular
let dbHandler = new db.DatabaseHandler(app);
// Passport middleware
app.use(passport.initialize());
// Passport config

const localStrategy = require('passport-local').Strategy;

dbHandler.useStudPassport(passport);
dbHandler.useProfPassport(passport);
app.post('/api/stud/cred/register', dbHandler.studentRegister);
app.post('/api/stud/cred/login', dbHandler.studentLogin);
app.post('/api/prof/cred/register', dbHandler.professorRegister);
app.post('/api/prof/cred/login', dbHandler.professorLogin);
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
