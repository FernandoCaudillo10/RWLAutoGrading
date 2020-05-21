import React  from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Menu from '../../menu/Menu';
import './recalGrades.scss';

class recalGrades extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grades: []
        };

        this.renderTableData = this.renderTableData.bind(this);

         axios({
                method: 'post',
                url: `https://rwlautograder.herokuapp.com/api/prof/rubric/${this.props.match.params.rubricID}/calibrate`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem('jwtToken'),
                }
              }).then ( res =>{
				this.state.grades = res.data;
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                  } else if (error.request){
                      console.log(error.request);
                  }else {
                      console.log(error.message);
                  }
              }).finally(() => {
				this.forceUpdate()	  
			  })
    }

  renderTableData() {
        return this.state.grades.map((c, index) => { console.log(Object.values(c[1]));
            let email = c[0];
			let obj = Object.values(c[1]);
			let grade = obj[1]; 

            return (
                <div className="classInfo">
                    <text><b>Student:</b>  {email}</text><br></br>
                    <text><b>Grade:</b>  {grade}</text><br></br>
			</div>
            )
        })
  	}

render() {
	let title = 'Student Recalibrated Grades';

    return (
			<div><Menu />
            <div className="ViewClassContainer">
				<h1 id="title">{title}</h1>
				<div id="classes">
            		{this.renderTableData()}
            	</div>
			</div>
			</div>
        )
    }
}

export default recalGrades;
