import React  from 'react'; 
import axios from 'axios';
import qs from 'qs'; 
import dateFormat from 'dateformat';
import './PAssignmentView.scss';
import Menu from '../menu/Menu'; 

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
		  'Authorization': localStorage.getItem('jwtToken'),
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
        <div>
        <div>
            <Menu />
        </div>
        <div className="professorContainer">
            <h2 className="h2class">Professor Assignment View</h2>
            <div className="AssignmenViewTable">
            <table>
			<tbody>
                <tr>
                    <td>Assignment Name</td>
                    <td>Due Date</td>
                    <td>Class</td>
                    <td></td>
                </tr>
                 {this.ProfessorAssignmnets()} 
			</tbody>
            </table>
            </div>
           
            
        </div>
        </div>  
    )

    }
}

export default PAssignmentView; 
