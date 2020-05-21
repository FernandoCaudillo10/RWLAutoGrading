import React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Link,
} from 'react-router-dom';

import ProfessorHomePage from './professorFlow/ProfessorHomePage/PHomePage';
import ProfessorAssignments from './professorFlow/ProfessorAssignment/ProfessorAssignments';
import PAssignmentView from './professorFlow/ProfessorAssignmentView/PAssignmentView';
import PSettings from './professorFlow/ProfessorSettings/PSettings';
import PSingleAssignmentView from './professorFlow/PSingleAssignmentView/ProfessorViewAssignment'; 
import ProfAssigView from './professorFlow/ProfAssView/ProfAssigView';
import ProfAssigEdit from './professorFlow/ProfAssEdit/ProfAssigEdit';
import ProfEval from './professorFlow/ProfEvalPage/ProfEval';
import recalGrades from './professorFlow/recalGrades/recalGrades';

import StudentHomePage from './studentFlow/StudentHomePage/StudentHomePage';
import SSettings from './studentFlow/StudentSettings/SSettings';
import Submit from './studentFlow/submit/Submit';
import StudentViewGradePage from './studentFlow/StudentViewGrade/StudentViewGradePage';
import StudViewClass from './studentFlow/StudentViewClass/StudViewClass';
import StudentEvalPage from './studentFlow/StudentEvalPage/StudEvalPage';


import Menu from './menu/Menu';
import axios from 'axios';
import HomePage from './home/HomePage';
import Login from './login/Login'; 
import Register from './register/Register'; 



import './App.scss';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			typeOfUser: '',
			name: '', 
			isLoggedIn: false
		};
	
		this.VerifyUser = this.VerifyUser.bind(this); 
		this.VerifyUser(); 

	
	}

	VerifyUser(){
 
		const token = localStorage.getItem("jwtToken");

		if(token){
			axios({
				method: 'get',
				url: 'https://rwlautograder.herokuapp.com/api/token/verify',
				headers: {
				  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
				  'Authorization': token,
				}
			  }).then ( res =>{
				  
				  if(res.data.error === false){	

					  this.setState({email : res.data.user.email, typeOfUser : res.data.user.type, name : res.data.user.name, isLoggedIn: true}); 

					  if(this.state.typeOfUser === 'professor'){
						  this.setState({isStudent : false});

					  }
					  if(this.state.typeOfUser === 'student'){
						this.setState({isStudent : true});
						
					  }
				  }else{
				      localStorage.removeItem("jwtToken");
					  localStorage.removeItem("typeOfUser");
					  localStorage.setItem("isLoggedIn", false);
					  this.setState({isLoggedIn: false}); 
				  }
			  }).catch((error) =>{
				  if(error.response){
					console.log(error.response.data);
				  }
				  console.log(error);
			  })
			
		}

	}


	render() {
		
	  return (
		<Router>
			<div>
				
				<Switch>
					<Route exact path="/menu" component={Menu}  />
					<Route exact path="/" component={Login}  />
					<Route exact path="/register" component={Register} />
					
					<Route exact path="/professor/classes" component={ProfessorHomePage} />
					<Route exact path="/professor/settings" component={PSettings} />
					<Route exact path="/professor/:classId/singleassignmentview/" component = {PSingleAssignmentView} />
					<Route exact path="/professor/class/:classId/assignment/create" component={ProfessorAssignments} />
					<Route exact path="/professor/class/:classId/assignments" component={PAssignmentView} />
					<Route exact path="/professor/class/:classId/assignment/:rubricId/view" component={ProfAssigView} />
					<Route exact path="/professor/class/:classId/assignment/:rubricId/edit" component={ProfAssigEdit} />
					<Route exact path="/professor" component={HomePage} />
					<Route exact path="/professor/class/:rubricID/student/evaluation" component={ProfEval} />
					<Route exact path="/professor/class/:rubricID/evaluation/grades" component={recalGrades} />
					
					<Route exact path="/student/settings" component={SSettings} />
					<Route exact path="/student/submit/:rubricID" component={Submit} />
					<Route exact path="/student" component={HomePage} />
					<Route exact path="/student/home" component={StudentHomePage} />
					<Route exact path="/student/home/:sectionID/assignment/grade" component={StudentViewGradePage} />
					<Route exact path="/student/home/classes" component={StudViewClass} />
					<Route exact path="/student/class/:rubricID/assignment/evaluation" component={StudentEvalPage} />
				</Switch>
			</div>
		</Router>
	  );
	}
}


export default App;
