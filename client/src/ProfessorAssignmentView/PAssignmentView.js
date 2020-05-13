import React  from 'react'; 
import axios from 'axios';
import qs from 'qs'; 
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import './PAssignmentView.scss';
import Menu from '../menu/Menu'; 
import PSingleAssignmentView from '../PSingleAssignmentView/ProfessorViewAssignment'; 


class PAssignmentView extends React.Component{

    constructor(props){
        super(props);     
    
    this.state = {
        assignments: [
		],
		singleAssignmentInfo: [

		]
		
    }
	this.ProfessorAssignmnets = this.ProfessorAssignmnets.bind(this);
	this.ViewAssignment = this.ViewAssignment.bind(this); 
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

ViewAssignment(event){
	event.preventDefault();
	const rubric_id = event.target.name;
	axios({
		method: 'get',
		url: `https://rwlautograder.herokuapp.com/api/prof/class/${this.props.match.params.classId}/assignment/${rubric_id}`,
		data: qs.stringify({
		}),
		headers: {
		  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  'Authorization': localStorage.getItem('jwtToken'),
		}
	  }).then ( res =>{
		  this.setState({ singleAssignmentInfo: res.data});
		this.props.history.push({
			pathname:"/professor/${this.props.match.params.classId}/singleassignmentview/",
			state:{
				info: this.state.singleAssignmentInfo,
			 }
		   });
		
	  }).catch((error) =>{
		  if(error.response){
			console.log(error.response.data);
		  }
	  })
	
}

ProfessorAssignmnets(){
	
    return(
		this.state.assignments ? this.state.assignments.map((item, key) =>
                <div key={item.class_id} className="assignmentBlock">
                    <div>{item.name}</div>
                    <div>
						<div> <strong>Assigned Date</strong> {dateFormat(item.assigned_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
						<div> <strong>Due Date</strong> {dateFormat(item.due_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
						<div> <strong>Final Due Date</strong> {dateFormat(item.final_due_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
					</div>
                    <div>{item.ClassName}</div>
                    <div>
						<div className="assignmentLinks">
						{/* <Link to={`/professor/class/${item.class_id}/assignments`}> <input type="submit" value="View" ></input> </Link> */}
							{/* <Link to={`/professor/:classId/singleassignmentview/`}> <input type="submit" value="View" ></input> </Link>
							 */}
							 <button name={item.rubric_id} onClick={this.ViewAssignment}>View</button>
							<Link to={'/'}> <input type="submit" value="Edit"></input> </Link>

						</div>
						
						<div className="assignmentLinks">
							<Link to={'/'}> <input type="submit" value="Disburse For Peer Grading"></input> </Link>
							<Link to={'/'}> <input type="submit" value="Submit Evaluations"></input> </Link>
						</div>
					</div>
                </div>
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
			<div className="assignmentsContainer">
                <div className="columnTitles">
                    <div>Assignment Name</div>
                    <div>Dates</div>
					<div>Actions</div>
                </div>
                 {this.ProfessorAssignmnets()} 

            </div>
           
        </div>
        </div>  
    )

    }
}

export default PAssignmentView; 
