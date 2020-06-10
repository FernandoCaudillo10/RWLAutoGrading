const {Pool} = require('pg');

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});

function getAllStudResponseGrades(rubric_id){
    return pool.query(`SELECT rs.student_email, e.response_grade FROM rubric r 
						JOIN prompt p ON r.rubric_id=p.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response rs ON rs.question_id=q.question_id 
						JOIN evaluation e ON rs.response_id=e.response_id 
						WHERE r.rubric_id='${rubric_id}'`);
}

function getAllProfResponseGrades(rubric_id){
    return pool.query(`SELECT rs.student_email, e.response_grade FROM rubric r 
						JOIN prompt p ON r.rubric_id=p.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response rs ON rs.question_id=q.question_id 
						JOIN prof_eval e ON rs.response_id=e.response_id 
						WHERE r.rubric_id='${rubric_id}';`);
}

function getStudentGrade(email, sectionID){
    return pool.query(`SELECT sr.rubric_id, SUM(response_grade)/COUNT(*) AS totalGrade, SUM(evaluation_grade)/COUNT(*) AS evalGrade FROM takes t 
						JOIN section_rubric sr ON sr.section_id=t.section_id 
						JOIN prompt p ON p.rubric_id=sr.rubric_id 
						JOIN question q ON p.prompt_id=q.prompt_id 
						JOIN response r ON r.question_id=q.question_id 
						JOIN evaluation e ON e.response_id=r.response_id 
						WHERE student_id='${email}' AND sr.section_id='${sectionID}' 
						GROUP BY sr.rubric_id ORDER BY sr.rubric_id`);
}

module.exports = {
		getAllStudResponseGrades,
		getAllProfResponseGrades,
		getStudentGrade,
}
