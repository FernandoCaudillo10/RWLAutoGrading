const {Pool} = require('pg');

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';

const pool = new Pool({
    connectionString: connString,
    ssl:true,
});

function deleteRubric(rub_id){
    return pool.query(`DELETE FROM rubric WHERE rubric_id='${rub_id}'`);
}

async function createRubric(assigned_date, due_date, final_due_date, assignment, ass_name){
    let result;
    await pool.query(`INSERT INTO rubric(assigned_date, due_date, final_due_date, name)
                        VALUES (to_timestamp('${assigned_date}'),to_timestamp('${due_date}'),to_timestamp('${final_due_date}'), '${ass_name}') RETURNING *`)
            .then((resultRubric) => {
                    result = resultRubric;
                    assignment.prompts.forEach((prompt) => {createPrompt(resultRubric.rows[0].rubric_id, prompt.prompt, prompt.questions)});
                });
    return result;
}

function createPrompt(rub_id, prompt_txt, questions){
    return pool.query(`INSERT INTO prompt(rubric_id, prompt_text) VALUES ('${rub_id}','${prompt_txt}') RETURNING *`)
                .then((resultPrompt) => {
                        return questions.forEach((q) => {createQuestion(resultPrompt.rows[0].prompt_id, q.question, q.min_char)});                                                                      });

}

function createQuestion(prompt_id, question_txt, min_char){
    return pool.query(`INSERT INTO question(question_text, prompt_id, min_char) VALUES ('${question_txt}','${prompt_id}', '${min_char}') RETURNING *`);
}

module.exports = {
	createQuestion,
	createPrompt,
	createRubric,
	deleteRubric,	
}
