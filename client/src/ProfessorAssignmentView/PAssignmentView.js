import React  from 'react'; 
import axios from 'axios';
import qs from 'qs'; 
import dateFormat from 'dateformat';
import './PAssignmentView.scss';

class PAssignmentView extends React.Component{

    constructor(props){
        super(props);     
    
    this.state = {
        assignments: [
        ]
    }
    this.ProfessorAssignmnets = this.ProfessorAssignmnets.bind(this);
	axios({
		method: 'get',
		url: `https://rwlautograder.herokuapp.com/api/prof/class/${this.props.match.params.classId}/assignments`,
		data: qs.stringify({
		}),
		headers: {
		  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphdmlzaUBnbWFpbC5jb20iLCJ0eXBlIjoicHJvZiIsImlhdCI6MTU4NzcxNTUyMiwiZXhwIjoxNTkwMTM0NzIyfQ.sTG7_BBTurj2pc0QTGuwIDFLRIZpDipx3CHQxocs0Os"
		}
	  }).then ( res =>{
		  console.log(res);
		  this.setState({loading: false, assignments: res.data });
	  }).catch((error) =>{
		  this.setState({loading: false});
		  if(error.response){
			console.log(error.response.data);
		  } else if (error.request){
			  console.log(error.request); 
		  }else {
			  console.log(error.message);
		  }
	  })
}

ProfessorAssignmnets(){
    return(
    	this.state.assignments ? this.state.assignments.map((item, key) =>
                <tr key={item.class_id}>
                    <td>{item.assignment_name}</td>
                    <td>{dateFormat(item.due_date, "dddd, mmmm dS, yyyy, h:MM TT")}</td>
                    <td>{item.ClassName}</td>
                    <td><input type="submit" value="Edit"></input></td>
                </tr>
        		)
				: 
				<div> </div>
            
    )
    
}



render(){

    return (
        <div className="professorContainer">
            <h2 className="h2class">Professor Assignment View</h2>
            <div className="AssignmenViewTable">
            <table>
                <tr>
                    <td>Assignment Name</td>
                    <td>Due Date</td>
                    <td>Class</td>
                    <td></td>
                </tr>
                 {this.ProfessorAssignmnets()} 
            </table>
            </div>
           

        </div>  
    )

    }
}

export default PAssignmentView; 