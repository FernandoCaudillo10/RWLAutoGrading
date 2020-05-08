import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import Menu from '../menu/Menu'; 


class SSettings extends React.Component {

    constructor(props){
        super(props);
       
        this.state = {
			className: "",
			email: '',
            password: '',
            emailConfirm: '',
			passwordConfirm: '',
			name: ''
			
        };
		
		this.GetUserInfo = this.GetUserInfo.bind(this); 
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handEmailChange = this.handEmailChange.bind(this); 
		this.handlePasswordChange = this.handlePasswordChange.bind(this); 
		this.GetUserInfo();

	}

	handlePasswordChange(event){

		event.preventDefault();
		const token = localStorage.getItem("jwtToken"); 
		var passwordComplexity = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"); 

		if(this.state.password !== this.state.passwordConfirm){
			document.getElementById("ErrorMessagesPassword").innerHTML = "";
			document.getElementById("SucessPasswordChange").innerHTML = "";
            document.getElementById("ErrorMessagesPassword").append("Passwords don't match");
            return;  
		}

		if(!passwordComplexity.test(this.state.password)){
			document.getElementById("ErrorMessagesPassword").innerHTML = "";
			document.getElementById("SucessPasswordChange").innerHTML = "";
            document.getElementById("ErrorMessagesPassword").append("Passwords must be at least size 6, at least one uppercase, and one number");
            return; 
		}
		

		axios({
			method: 'put',
			url: 'https://rwlautograder.herokuapp.com/api/stud/cred/update',
			data: qs.stringify({
				password: this.state.passwordConfirm,
				name:this.state.name
			}),
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  'Authorization': token,
			}
		  }).then ( res =>{
			document.getElementById("ErrorMessagesPassword").innerHTML = "";
			document.getElementById("SucessPasswordChange").innerHTML = "";
			document.getElementById("SucessPasswordChange").append("Sucessfully updated password");
		  }).catch((error) =>{
			  if(error.response){
				console.log(error.response.data);
				document.getElementById("ErrorMessagesEmail").innerHTML = "";
            	document.getElementById("ErrorMessagesEmail").append("Error occurred");
			  } 
		  })

	}

	handEmailChange(event){
		event.preventDefault();
		const token = localStorage.getItem("jwtToken"); 
		var validator = require("email-validator");

        if (!validator.validate(this.state.emailConfirm)){
			document.getElementById("ErrorMessagesEmail").innerHTML = "";
			document.getElementById("SuccessEmailChange").innerHTML = "";
            document.getElementById("ErrorMessagesEmail").append("Invalid email");
            return; 
		}

		axios({
			method: 'put',
			url: 'https://rwlautograder.herokuapp.com/api/stud/cred/update',
			data: qs.stringify({
				email: this.state.emailConfirm,
				name: this.state.name
			}),
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  'Authorization': token,
			}
		  }).then ( res =>{
			document.getElementById("ErrorMessagesEmail").innerHTML = "";
			document.getElementById("SuccessEmailChange").innerHTML = "";
            document.getElementById("SuccessEmailChange").append("Sucessfully updated email");
		  }).catch((error) =>{
			  if(error.response){
				console.log(error.response.data);
				document.getElementById("ErrorMessagesEmail").innerHTML = "";
            	document.getElementById("ErrorMessagesEmail").append("Error occurred");
			  } 
		  })

	}

	handleNameChange(event){
		event.preventDefault();

		const token = localStorage.getItem("jwtToken");

		axios({
			method: 'put',
			url: 'https://rwlautograder.herokuapp.com/api/stud/cred/update',
			data: qs.stringify({
				name: this.state.name
			}),
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  'Authorization': token,
			}
		  }).then ( res =>{
			document.getElementById("SuccessNameChange").innerHTML = "";
            document.getElementById("SuccessNameChange").append("Sucessfully updated name");
			
		  }).catch((error) =>{
			  if(error.response){
				console.log(error.response.data);
				document.getElementById("ErrorMessagesName").innerHTML = "";
            	document.getElementById("ErrorMessagesName").append("Error occurred");
			  } 
		  })

	}
	
	GetUserInfo(){
		const token = localStorage.getItem("jwtToken");
		axios({
			method: 'get',
			url: 'https://rwlautograder.herokuapp.com/api/token/verify',
			data: qs.stringify({
			}),
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  'Authorization': token,
			}
		  }).then ( res =>{ 
			if(res.statusText ==="OK"){
				this.setState({name: res.data.user.name, email: res.data.user.email })
			}
		  }).catch((error) =>{
			  if(error.response){
				console.log(error.response.data);
			  }
		  })
	}
    
      handleFormChange(event) {
		this.setState({ [event.target.name]: event.target.value });
		
      }
    

	render(){ 
		return (
			<div>
			<div>
				<Menu />
			</div>
			
			<div className="professorContainer Login">


				<form onSubmit={this.handleNameChange}>
				<h3>Change Name</h3>
            		<div >
                    	<input className="RegisterFields" type='text' placeholder= {this.state.name} name="name" onChange={this.handleFormChange} ></input>
                	</div>
					<div id="ErrorMessagesName">
                       
                       </div>
					   <div id="SuccessNameChange">
                       
                       </div>

					<div>
                		<input type='submit' value='Save' className="RegisterButton"></input>
            			</div>

					</form>


					<hr></hr>

					<form onSubmit={this.handEmailChange}>
					<h3>Change Email</h3>
                	<div>
                    	<input className="RegisterFields" type='text' placeholder= {this.state.email} name="email" onChange={this.handleFormChange} disabled></input>
                	</div>
                	<div >
                    	<input className="RegisterFields" type='text' placeholder='New Email' name="emailConfirm" onChange={this.handleFormChange}></input>
                	</div>
					<div id="ErrorMessagesEmail">
                       
                       </div>
					   <div id="SuccessEmailChange">
                       
                       </div>

					<div>
                		<input type='submit' value='Save' className="RegisterButton"></input>
            		</div>
					</form>

					<hr></hr>

					<form onSubmit={this.handlePasswordChange}>
					<h3>Change Password</h3>
                	<div >
                    	<input className="RegisterFields" type='password' placeholder='New Password' name="password" onChange={this.handleFormChange}></input>
                	</div>
                	<div >
                    	<input className="RegisterFields" type='password' placeholder='Confirm Password' name="passwordConfirm" onChange={this.handleFormChange}></input>
                	</div>
                		<div id="ErrorMessagesPassword">
                       
                       </div>
					   <div id="SucessPasswordChange">
                       
                       </div>

            			<div>
                			<input type='submit' value='Save' className="RegisterButton"></input>
            			</div>
            		</form>
				</div>
			
			</div>
				

		)

	}
}
export default SSettings;
