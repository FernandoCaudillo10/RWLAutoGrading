const qry = require('./queries');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)][1].value, //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i][1].value < pivot) {
            i++;
        }
        while (items[j][1].value > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

async function distributeRubricStudents(studentsToGrade, rubricId){
	let resultResponses = await qry.getResponsesToRubric(rubricId);
	
	// {stud_email: [response]}
	let studentToResponses = {};

	resultResponses.rows.forEach((response) => {
		if(response.student_email in studentToResponses){
			studentToResponses[response.student_email].push(response.response_id);
		}
		else{
			studentToResponses[response.student_email] = [response.response_id];
		}
	});
	
	let students = shuffleArray(studentToResponses.keys());
	
	for(let i = 0; i < students.length; i++){
		for(let j = 1; j <= studentsToGrade; j++){
			studentToResponses[students[(i + j) % students.length]].forEach((response) =>{qry.createEvaluation(response.response_id, students[i])});
		}
	}
}

async function distributeRubricProfessor(prof_email, rubricId){
	let resultResponseGrade = await qry.getAllResponseGrades(rubricId);
	
	// {stud_email: [res_grade]}
	let studentToGrade = {};

	resultResponseGrade.rows.forEach((response) => {
		if(response.student_email in studentToGrade){
			studentToGrade[response.student_email].push(response.response_grade);
		}
		else{
			studentToResponses[response.student_email] = [response.response_grade];
		}
	});
	
	// {stud_email: avg_grade}
	let studentAvgGrade = {};
	for(student in studentToGrade){
		let sum = 0.0;
		studentToGrade[student].forEach((grade) => {
			sum += grade;
		});
		studentAvgGrade[student] = sum / studentToGrade[student].length;
	}
	
	let sortedByGrade = quickSort(studentAvgGrade.entries(), 0, studentAvgGrade.length - 1);
	
	let studentAmount = Math.ceil(sortedByGrade.length * 0.1)
	
	let bucketSize = Math.floor(sortedByGrade.length / studentAmount);
	
	let studentsBeingGraded = [];
	for(let i=0; i < sortedByGrade.length; i += bucketSize){
		studentsBeingGraded.push(sortedByGrade[i][0]);
	}
	if(sortedByGrade.length % bucketSize != 0){
		studentsBeingGraded.push(sortedByGrade[i][0]);
	}
	
	studentsBeingGraded.forEach((stud_email) => {
		qry.getResponsesByStudent(stud_email, rubricId)
			.then((result) => {
				result.rows.forEach((response) => {
					qry.createProfEval(prof_email, response.response_id);
				});
			})
	});
}

function findProfGrade(array){
	let result = [];
	array.forEach((e) => {
		result.push(e);
	});
	return result;
}

async function calibrateGrades(rubricId){
	let resultResponseGrade = await qry.getAllResponseGrades(rubricId);
	
	// {stud_email: [res_grade]}
	let studentToGrade = {};

	resultResponseGrade.rows.forEach((response) => {
		if(response.student_email in studentToGrade){
			studentToGrade[response.student_email].push(response.response_grade);
		}
		else{
			studentToResponses[response.student_email] = [response.response_grade];
		}
	});
	

	let resultProfEval = await getAllProfResponseGrades(rubricId);
	
	let studentToProfGrade = {};
	resultProfEval.rows.forEach((studGrade) => {
		studentToResponses[response.student_email] = response.response_grade;
	});

	let studentAvgGrade = {};
	for(student in studentToGrade){
		if(student in studentToProfGrade){
			studentAvgGrade[student] = { type: "prof", value: studentToProfGrade[student]};
		}
		else{
			let sum = 0.0;
			studentToGrade[student].forEach((grade) => {
				sum += grade;
			});
			studentAvgGrade[student] = { type: "stud", value: sum / studentToGrade[student].length };
		}
	}
	
	let sortedByGrade = quickSort(studentAvgGrade.entries(), 0, studentAvgGrade.length - 1);
	
	let indexHasProfGrade = findProfGrade(sortedByGrade);

	for(let i=0; i<indexHasProfGrade.length -1; i++){
		let first = indexHasProfGrade[i];
		let second = indexHasProfGrade[i+1];
		
		let A = [first, sortedByGrade[first].value];
		let B = [second, sortedByGrade[second].value];
		
		let m = (A[1] - B[1]) / (A[0] - B[0] * 0.0);
		let b = A[1] - (m * A[0]);
		
		for(let x=first; x<=second; x++){
			let y = (m * x) + b;
			
			sortedByGrade[x].value = y;
		}
	}
	
	return sortedByGrade;
}

module.exports = {
	distributeRubricStudents,
	distributeRubricProfessor,
	calibrateGrades,
};
