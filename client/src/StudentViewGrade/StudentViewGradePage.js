import React  from 'react';
import axios from 'axios';
import './StudentViewGrade.scss';

class StudentViewGradePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			grades: []
		};

		this.renderTableData = this.renderTableData.bind(this);
	
		 axios({
                method: 'get',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/grade', 
                headers: {
                  	'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
               		'Authorization': localStorage.getItem('jwtToken'),
			    }
              }).then ( res =>{
				this.setState({grades: res.data});
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
	
	renderTableData() {
		return this.state.grades.map((grade, index) => {
			const { rubric_id, total } = grade	
			return (
				<tr>
					<td>{rubric_id}</td>
					<td>{total}</td>
				</tr>
			)
		})
	}

render() {
	return (
            <div className="ViewGradeContainer">
                <table id="GradeTable">
					<tbody>
                    	<tr>
							<th>Class</th>
                    		<th>Assignment Grade</th>
                    		<th>Evaluation Grade</th>
                    	</tr>
					</tbody>
					<tbody>
							{this.renderTableData()}
					</tbody>
                </table>
            </div>
        )
	}
}

export default StudentViewGradePage;
