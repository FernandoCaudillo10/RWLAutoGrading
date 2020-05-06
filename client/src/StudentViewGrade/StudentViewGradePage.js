import React  from 'react';
import axios from 'axios';
import './StudentViewGrade.scss';

class StudentViewGradePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			className: '',
			assingGrade: '',
			evalGrade: '',
		};
	}
	
	tableBody() {
		 axios({
                method: 'get',
                url: 'https://rwlautograder.herokuapp.com/api/stud/registered/class/info', 
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
              }).then ( res =>{
                console.log(res)
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                  } else if (error.request){
                      console.log(error.request);
                  }else {
                      console.log(error.message);
                  }
              })
	
	}

render() {
	return (
            <div className="ViewGradeContainer">
                <table id="GradeTable">
                    <tr>
						<th>Class</th>
                    	<th>Assignment Grade</th>
                    	<th>Evaluation Grade</th>
                    </tr>
					{this.tableBody()}
                </table>
            </div>
        )
	}
}

export default StudentViewGradePage;
