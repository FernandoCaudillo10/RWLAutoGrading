const qry = require('./queries');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
	return array;
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
	
	console.log(resultResponses.rows);
	resultResponses.rows.forEach((response) => {
		if(response.student_email in studentToResponses){
			studentToResponses[response.student_email].push(response.response_id);
		}
		else{
			studentToResponses[response.student_email] = [response.response_id];
		}
	});
	console.log(studentToResponses);
	let students = await shuffleArray(Object.keys(studentToResponses));
	console.log(students);
	for(let i = 0; i < students.length; i++){
		for(let j = 1; j <= studentsToGrade; j++){
			studentToResponses[students[(i + j) % students.length]].forEach((response) =>{qry.createEvaluation(response, students[i])});
		}
	}
}

async function distributeRubricProfessor(prof_email, rubricId, studentAmount){
	let resultResponseGrade = await qry.getAllStudResponseGrades(rubricId);
	
	// {stud_email: [res_grade]}
	let studentToGrade = {};

	resultResponseGrade.rows.forEach((response) => {
		if(response.student_email in studentToGrade){
			studentToGrade[response.student_email].push(response.response_grade);
		}
		else{
			studentToGrade[response.student_email] = [response.response_grade];
		}
	});
	
	// {stud_email: avg_grade}
	let studentAvgGrade = {};
	for(student in studentToGrade){
		let sum = 0.0;
		studentToGrade[student].forEach((grade) => {
			sum += grade;
		});
		studentAvgGrade[student] = { value: sum / studentToGrade[student].length };
	}
	
	let entries = Object.entries(studentAvgGrade);
	let sortedByGrade = quickSort(entries, 0, entries.length - 1);
	
	let bucketSize = Math.floor(sortedByGrade.length / (studentAmount * 1.0));
	
	console.log(bucketSize);
	let studentsBeingGraded = [];
	for(let i=0; i < sortedByGrade.length; i += bucketSize){
		studentsBeingGraded.push(sortedByGrade[i][0]);
	}
	if(sortedByGrade.length - 1 % bucketSize != 0){
		studentsBeingGraded[studentsBeingGraded.length - 1] = sortedByGrade[sortedByGrade.length - 1][0];
	}
	console.log(sortedByGrade);
	console.log(studentsBeingGraded);
	
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
	for(let i=0; i<array.length; i++){
		if(array[i][1].type === 'prof') result.push(i);
	}
	return result;
}

async function calibrateGrades(rubricId){
	let resultResponseGrade = await qry.getAllStudResponseGrades(rubricId);
	
	// {stud_email: [res_grade]}
	let studentToGrade = {};

	resultResponseGrade.rows.forEach((response) => {
		if(response.student_email in studentToGrade){
			studentToGrade[response.student_email].push(response.response_grade);
		}
		else{
			studentToGrade[response.student_email] = [response.response_grade];
		}
	});
	

	let resultProfEval = await qry.getAllProfResponseGrades(rubricId);
	
	let studentToProfGrade = {};
	resultProfEval.rows.forEach((profEval) => {
		studentToProfGrade[profEval.student_email] = +(profEval.response_grade);
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

	let entries = Object.entries(studentAvgGrade);
	let sortedByGrade = quickSort(entries, 0, entries.length - 1);
	
	let indexHasProfGrade = findProfGrade(sortedByGrade);
	
	console.log(sortedByGrade);
	console.log(indexHasProfGrade);
	for(let i=0; i<indexHasProfGrade.length -1; i++){
		let first = indexHasProfGrade[i];
		let second = indexHasProfGrade[i+1];
		
		let A = [first, sortedByGrade[first][1].value];
		let B = [second, sortedByGrade[second][1].value];
		
		let m = (A[1] - B[1]) / +(A[0] - B[0]);
		let b = A[1] - (m * A[0]);
		
		for(let x=first; x<=second; x++){
			let y = (m * x) + b;
			console.log(m,x,b)
			sortedByGrade[x][1].value = y;
		}
	}
	console.log(sortedByGrade);
	return sortedByGrade;
}

module.exports = {
	distributeRubricStudents,
	distributeRubricProfessor,
	calibrateGrades,
};
