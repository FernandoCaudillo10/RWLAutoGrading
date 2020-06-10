const {Pool} = require('pg');

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});

function getAssignment(rub_id){
    return pool.query(`SELECT DISTINCT p.*, q.* FROM rubric r 
							JOIN prompt p ON r.rubric_id=p.rubric_id 
							JOIN question q ON p.prompt_id=q.prompt_id 
							WHERE r.rubric_id='${rub_id}'`);
}

async function submitAssignment(email, assignment){
    let result = await assignment.responses.forEach(async (res) => {
        return pool.query(`INSERT INTO response (response_id, student_email, response_value, question_id) 
							VALUES (DEFAULT, '${email}', '${res.response}', '${res.qsID}') RETURNING *`);
   
    return result;
}

function getStudentResponse(rId){
    return pool.query(`SELECT * FROM response WHERE response_id='${rId}'`);
}

function getStudentsRespondedToRubric(rubric_id){
    return pool.query(`SELECT DISTINCT(rs.student_email) FROM rubric r 
						JOIN prompt p ON r.rubric_id=p.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response rs ON rs.question_id=q.question_id 
						WHERE r.rubric_id='${rubric_id}'`);
}

function getResponsesByStudent(stud_email, rubric_id){
    return pool.query(`SELECT rs.response_id FROM rubric r 
						JOIN prompt p ON r.rubric_id=p.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response rs ON rs.question_id=q.question_id 
						WHERE r.rubric_id='${rubric_id}' AND rs.student_email='${stud_email}'`);
}

function getResponsesToRubric(rubric_id){
    return pool.query(`SELECT rs.response_id, rs.student_email FROM rubric r 
						JOIN prompt p ON r.rubric_id=p.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response rs ON rs.question_id=q.question_id 
						WHERE r.rubric_id='${rubric_id}'`);
}

function getAllClassAssignments(class_id){
    return pool.query(`SELECT DISTINCT(r.*) FROM section s 
						JOIN section_rubric sr ON s.section_id=sr.section_id 
						JOIN rubric r ON sr.rubric_id=r.rubric_id 
						WHERE s.class_id='${class_id}'`);
}

function getAssignRubric(sectionID){
    return pool.query(`SELECT DISTINCT * FROM rubric r 
						JOIN section_rubric sr ON sr.rubric_id=r.rubric_id WHERE sr.section_id='${sectionID}' AND r.due_date >= NOW()`);
}

function getAllRubricsBeforeNow(){
    return pool.query(`SELECT * FROM rubric WHERE CURRENT_TIMESTAMP <= rubric.due_date;`);
}

module.exports = {
    	getStudentsRespondedToRubric,
    	getResponsesByStudent,
    	getResponsesToRubric,
   		getStudentResponse,
		getAssignment,
		submitAssignment,
		getAllClassAssignments,
		getAssignRubric,
		getAllRubricsBeforeNow,
}
