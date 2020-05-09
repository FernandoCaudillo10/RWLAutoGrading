import React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Link,
} from 'react-router-dom';

import HomePage from './home/HomePage';
import Login from './login/Login'; 
import Register from './register/Register'; 
import ProfessorHomePage from './ProfessorHomePage/PHomePage';
import ProfessorAssignments from './ProfessorAssignment/ProfessorAssignments';
import PAssignmentView from './ProfessorAssignmentView/PAssignmentView';
import StudentHomePage from './StudentHomePage/StudentHomePage';
import PSettings from './ProfessorSettings/PSettings';
import SSettings from './StudentSettings/SSettings';
import Grade from './grade/Grade'; 
import StudentGradesPage from './StudentGradesPage/SGP';
import Submit from './submit/Submit';
import Menu from './menu/Menu';
import StudentViewGradePage from './StudentViewGrade/StudentViewGradePage';
import StudViewClass from './StudentViewClass/StudViewClass';
import axios from 'axios';

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
					<Route exact path="/student/grades" component={StudentGradesPage} />
					<Route exact path="/student/settings" component={SSettings} />
					<Route exact path="/student/grade/:rubricID" component={Grade} />
					<Route exact path="/student/submit/:rubricID" component={Submit} />
					<Route exact path="/student" component={HomePage} />
					<Route exact path="/professor/class/:classId/assignment/create" component={ProfessorAssignments} />
					<Route exact path="/professor/class/:classId/assignments" component={PAssignmentView} />
					<Route exact path="/professor" component={HomePage} />
					<Route exact path="/student/home" component={StudentHomePage} />
					<Route exact path="/student/home/:sectionID/assignment/grade" component={StudentViewGradePage} />
					<Route exact path="/student/home/classes" component={StudViewClass} />
				</Switch>
			</div>
		</Router>
	  );
	}
}


export default App;
