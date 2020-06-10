const {Pool} = require('pg');

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});


function getProfEval(rubricID, email){
    return pool.query(`SELECT e.eval_id, p.prompt_text, q.question_id, q.question_text, r.response_id, r.response_value 
							FROM prof_eval e 	
							JOIN response r ON e.response_id=r.response_id 
							JOIN question q ON r.question_id=q.question_id 
							JOIN prompt p ON q.prompt_id=p.prompt_id 
							WHERE professor_email='${email}' AND p.rubric_id='${rubricID}'`);
}

function createProfEval(email, resId, grade) {
    if(grade)
        return pool.query(`INSERT INTO prof_eval(professor_email, response_id, response_grade) 
							VALUES ('${email}','${resId}', '${grade}') RETURNING *`);
    else
        return pool.query(`INSERT INTO prof_eval(professor_email, response_id) 
							VALUES ('${email}','${resId}') RETURNING *`);
}

function createEvaluation(rubric_id, student_email){
    return pool.query(`INSERT INTO evaluation(student_email, response_id) 
						VALUES('${student_email}', '${rubric_id}') RETURNING *`);
}

async function submitProfEval(assignment){
    let result = await assignment.evaluation.forEach((eval) => {
        return pool.query(`UPDATE prof_eval SET response_grade='${eval.grade}' WHERE eval_id='${eval.evaluation_id}' RETURNING *`);
    });
    return result;
}

function getEvalAssignment(email, rubricID){
    return pool.query(`SELECT e.eval_id, p.prompt_text, q.question_id, q.question_text, r.response_id, r.response_value
                        FROM evaluation e
                        JOIN response r ON e.student_email='${email}' AND e.response_id=r.response_id
                        JOIN question q ON r.question_id=q.question_id
                        JOIN prompt p ON q.prompt_id=p.prompt_id
                        WHERE p.rubric_id='${rubricID}' ORDER BY question_id ASC`);
}

async function submitEvalGrade(assignment){
    let result = await assignment.evaluation.forEach((eval) => {
        return pool.query(`UPDATE evaluation SET response_grade='${eval.grade}' WHERE eval_id='${eval.evaluation_id}' RETURNING *`);
    });
    return result;
}

module.exports = {
    	getEvalAssignment,
    	submitEvalGrade,
		getProfEval,
		createProfEval,
		createEvaluation,
		submitProfEval,
}
