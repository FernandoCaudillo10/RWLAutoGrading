const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 8080;
const db = require('./backend/queries')
const routes = require('./backend/routes');
const localPassport = require("./backend/passport");
const passport = require('passport');
const bcrypt = require("bcryptjs");
const cors = require('cors')

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(passport.initialize()); // Passport middleware for login/regist/jwt
app.use(cors()); // Cors middleware to allow all Cross-origin access


// Passport config
localPassport.useJWT(passport);
localPassport.useStudPassport(passport);
localPassport.useProfPassport(passport);

// Database handler to make api endpoints modular
let Routes = new routes.RoutesHandler(app);
app.post('/api/stud/cred/register', Routes.studentRegister);
app.post('/api/stud/cred/login', Routes.studentLogin);
app.post('/api/prof/cred/register', Routes.professorRegister);
app.post('/api/prof/cred/login', Routes.professorLogin);
app.put('/api/stud/cred/update', Routes.studentUpdate);
app.put('/api/prof/cred/update', Routes.professorUpdate);
app.get('/api/prof/class/:classId/assignments', Routes.classAssignments);
app.post('/api/prof/class/:classId/section/create', Routes.createSection);
app.post('/api/prof/class/:classId/assignment/create', Routes.createAssignment); 
app.delete('/api/prof/class/:classId/assignment/:rubId/delete', Routes.deleteAssignment); 
app.get('/api/prof/class/:classId/assignment/:rubId', Routes.getAssignment); 
app.post('/api/prof/class/create', Routes.createClass);
app.get('/api/prof/class/:classId', Routes.getClassSections);
app.get('/api/*', (request,response) => response.status(404).json({Error: "Endpoint does not exist"}));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
