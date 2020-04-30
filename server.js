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
const cron = require('node-cron');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(passport.initialize()); // Passport middleware for login/regist/jwt
app.use(cors()); // Cors middleware to allow all Cross-origin access


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
app.get('/api/token/verify', Routes.tokenVerify);

app.get('/api/stud/registered/class/info', Routes.studentGetClassInfo);
app.get('/api/stud/class/:classID/assignment/dates', Routes.studentAssignmentRubric);
app.get('/api/stud/class/:rubricID/assignments', Routes.studentGetAssignment);
app.get('/api/stud/class/assignment/evaluation', Routes.studentEvaluateAssignment);
app.post('/api/stud/class/assignment/questions/submit', Routes.studentSubmitAssignment);
app.get('/api/stud/class/assignment/grade', Routes.studentGetGrade);
app.post('/api/stud/class/assignment/evaluation/grade/submit', Routes.studentSubmitGrade);
app.post('/api/stud/class/register/:sectionID', Routes.studentRegisterClass);
app.post('/api/stud/class/unregister/:sectionID', Routes.studentUnregisterClass);

app.get('/api/prof/class/:classId/assignments', Routes.classAssignments);
app.post('/api/prof/class/:classId/section/create', Routes.createSection);
app.post('/api/prof/class/:classId/assignment/create', Routes.createAssignment); //
app.delete('/api/prof/class/:classId/assignment/:rubId/delete', Routes.deleteAssignment); 
app.get('/api/prof/class/:classId/assignment/:rubId', Routes.getAssignment); 
app.post('/api/prof/class/create', Routes.createClass); //
app.post('/api/prof/class/:classId/section/:secId/response/:resId/evaluate', Routes.submitProfEval);
app.get('/api/prof/class/:classId', Routes.getClassSections);
app.get('/api/prof/classes', Routes.getClasses); //
app.post('/api/prof/rubric/:rubId/students/distribute', Routes.distributeToStudents);
app.post('/api/prof/rubric/:rubId/distribute', Routes.distributeToProfessor);
app.post('/api/prof/rubric/:rubId/calibrate', Routes.calibrateGrades);

app.get('/api/*', (request,response) => response.status(404).json({Error: "Endpoint does not exist"}));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
