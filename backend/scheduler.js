const qry = require('./queries');
const hlprs = require('./helpers');
const schedule = require('node-schedule');

let scheduledRubrics = {};

async function schedulerStart(){
	try{
		let resultRubricAll = await qry.getAllRubricsBeforeNow();
		
		resultRubricAll.rows.forEach((rubric) => {
			scedulerAdd(rubric);
		});
	}catch(err){
		console.log(`ERROR! Scheduler Start Failed ->\n${err}`);
	}
}

function schedulerAdd(rubric){
	try{
		scheduledRubrics[rubric.rubric_id] = schedule.scheduleJob(rubric.due_date, hlprs.distributeRubric(rubric.rubric_id))
													.bind(null, rubric.rubric_id);
	}catch(err){
		console.log(`ERROR! Scheduler Add Failed ->\n${err}`);
	}
}

function schedulerDelete(){
	
}

module.exports = {

};
