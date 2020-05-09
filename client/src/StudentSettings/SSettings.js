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
		
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this); 
		

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
	
	tableBody(){
		return (
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
					<br/>
					<div> Register for a Class </div>
					<div>
						<input className="LoginFields" type='text' placeholder='Class Name' name="rclassName" onChange={this.handleFormChange}></input>
					</div>
					<input type='submit' value='Register' className="LoginButton"></input><br/><br/>
					<div> Unregister for a Class </div>
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
			
			// </div>
				

		)
	}
	
	render() {
		return (
			<div>
			<div><Menu/></div>				
			<div className="Home">
				{this.tableBody()}
			</div> 
			</div>
		)
	}
}
export default SSettings;
