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
			]
		}

		this.ProfessorAssignmnets = this.ProfessorAssignmnets.bind(this);
		this.distStud = this.distStud.bind(this);
		this.distProf = this.distProf.bind(this);
		this.submitEval = this.submitEval.bind(this);
		let cId = this.props.match.params.classId;

		axios({
			method: 'get',
			url: `https://rwlautograder.herokuapp.com/api/prof/class/${cId}/assignments`,
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

	distStud(rubId){
		axios({
			method: 'post',
			url: `https://rwlautograder.herokuapp.com/api/prof/rubric/${rubId}/students/distribute`,
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  	  'Authorization': localStorage.getItem('jwtToken'),
			}
		 }).then ( res =>{
			 console.log(res);
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
	distProf(rubId){
		axios({
			method: 'post',
			url: `https://rwlautograder.herokuapp.com/api/prof/rubric/${rubId}/distribute`,
			headers: {                                 
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  	  'Authorization': localStorage.getItem('jwtToken'),
			}
		 }).then ( res =>{
			 console.log(res);
		 }).catch((error) =>{
		     if(error.response){
		   	console.log(error.response.data);
		     } else if (error.request){
		   	  console.log(error.request); 
		     }else {
		   	  console.log(error.message);
		     }
		 });
	}

	submitEval(rubId){
		axios({
			method: 'post',
			url: `https://rwlautograder.herokuapp.com/api/prof/rubric/${rubId}/calibrate`,
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  	  'Authorization': localStorage.getItem('jwtToken'),
			}
		 }).then ( res =>{
			 console.log(res);
		 }).catch((error) =>{
		     if(error.response){
		   	console.log(error.response.data);
		     } else if (error.request){
		   	  console.log(error.request); 
		     }else {
		   	  console.log(error.message);
		     }
		 });
	}

	ProfessorAssignmnets(){
		let cId = this.props.match.params.classId;
		
		return(
			this.state.assignments ? this.state.assignments.map((item, key) =>
					<div key={item.rubric_id} className="assignmentBlock">
						<div>{item.name}</div>
						<div>
							<div> <strong>Assigned Date</strong> {dateFormat(item.assigned_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
							<div> <strong>Due Date</strong> {dateFormat(item.due_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
							<div> <strong>Final Due Date</strong> {dateFormat(item.final_due_date, "dddd, mmmm dS, yyyy, h:MM TT")} </div>
						</div>
						<div>{item.ClassName}</div>
						<div className="assLinkCont">
							<div className="assignmentLinks">
								<Link to={`/professor/class/${cId}/assignment/${item.rubric_id}/view`}> <input type="submit" value="View" ></input> </Link>
								<Link to={`/professor/class/${cId}/assignment/${item.rubric_id}/edit`}> <input type="submit" value="Edit"></input> </Link>
							</div>
							<div className="assignmentLinks">
							  <input type="submit" value="Disburse To Students" onClick={() =>   { this.distStud(item.rubric_id)}}></input>
								<input type="submit" value="Disburse To Myself" onClick={() =>   { this.distProf(item.rubric_id)}}></input>
								<input type="submit" value="Submit Evaluations" onClick={() => { this.submitEval(item.rubric_id)}}></input>
							</div>
						</div>
					</div>
					)
					: 
					<div> </div>
				
		)
		
	}



	render(){
		let cId = this.props.match.params.classId;
		console.log(cId);
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
