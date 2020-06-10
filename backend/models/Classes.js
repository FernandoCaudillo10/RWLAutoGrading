const {Pool} = require('pg');

//protocol://DBusername:DBpassword@localhost:5432/DBname
var connString = (process.env.PORT)? process.env.DATABASE_URL : 'postgresql://me:password@localhost:5432/api';                              
    
const pool = new Pool({
    connectionString: connString,
    ssl:true,   
});

function getAllClasses(email){
    return pool.query(`SELECT * FROM class WHERE class.professor_email='${email}'`);
}

function createClass(email, name){
    return pool.query(`INSERT INTO class(professor_email, name) VALUES ('${email}','${name}') RETURNING *`);
}

function createSection(class_id){
    return pool.query(`INSERT INTO section(class_id) VALUES ('${class_id}') RETURNING *`);
}

function getStudClasses(email){
        return pool.query(`SELECT class.*, section.section_id FROM takes
                            JOIN section ON takes.section_id=section.section_id
                            JOIN class ON class.class_id=section.class_id
                            WHERE student_id='${email}'`);
}

function studRegClass(email, sectionID){
        return pool.query(`INSERT INTO takes (student_id, section_id) VALUES ('${email}','${sectionID}') RETURNING *`);
}

function studRemoveClass(email, sectionID){
        return pool.query(`DELETE FROM takes WHERE student_id='${email}' AND section_id='${sectionID}' RETURNING *`);
}

function getClassSections(class_id){
    return pool.query(`SELECT * FROM class c JOIN section s ON c.class_id=s.class_id WHERE c.class_id='${class_id}'`);
}

function getClass(class_id){
    return pool.query(`SELECT * FROM class WHERE class.class_id='${class_id}'`);
}

function takesCheck(email, classID){
    return pool.query(`SELECT * FROM takes t 
						JOIN section s ON s.section_id=t.section_id 
						JOIN class c ON c.class_id=s.class_id 
						WHERE student_id='${email}' AND c.class_id='${classID}'`);
}

function connectSectionRubric(sec_id, rub_id){
    return pool.query(`INSERT INTO section_rubric(section_id, rubric_id) VALUES ('${sec_id}','${rub_id}') RETURNING *`);
}

module.exports = {
        getStudClasses,
        studRegClass,
        studRemoveClass,
		getAllClasses,
		createClass,
		createSection,
		takesCheck,
		getClass,
		getClassSections,
		connectSectionRubric,
}
