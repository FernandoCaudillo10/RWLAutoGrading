import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import './Login.scss'

class Login extends React.Component {

    constructor(props){
        super(props);
       
        this.state = {
            email: '',
            password: '',
            typeOfUser: '',
        };
        
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this); 

    }
    
    handleFormChange(event) {
       
        this.setState({ [event.target.name]: event.target.value });
      }

      handleSelectOption(event){
          this.setState({typeOfUser: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
		
        if(this.state.typeOfUser === "Student"){
			axios({
				method: 'post',
				url: 'https://rwlautograder.herokuapp.com/api/stud/cred/login',
				data: qs.stringify({
				  email: this.state.email,
				  password: this.state.password
				}),
				headers: {
				  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				}
			  }).then ( res =>{
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
        else if(this.state.typeOfUser === "Teacher"){
			axios({
				method: 'post',
				url: 'https://rwlautograder.herokuapp.com/api/prof/cred/login',
				data: qs.stringify({
				  email: this.state.email,
				  password: this.state.password
				}),
				headers: {
				  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
				}
			  }).then ( res =>{
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
        
        
      }

render(){ 
    return (
        <div className="Login">
            <h1>Log In</h1>
            <form onSubmit={this.handleSubmit}>
                <div>
                    <input className="LoginFields" type='text' placeholder='Email' name="email"  onChange={this.handleFormChange}></input>
                </div>
                <div>
                    <input className="LoginFields" type='password' placeholder='Password' name="password"   onChange={this.handleFormChange}></input>
                </div>
           
				<select value={this.state.typeOfUser} onChange={this.handleSelectOption}>
					<option value="" name ="typeOfUser"></option>
					<option value="Student" name ="typeOfUser">Student</option>
					<option value="Teacher" name ="typeOfUser">Teacher</option>
				</select>

                <input type='submit' value='Log In' className="LoginButton" ></input>
            </form>

          

        </div>
            

    )

}
}
export default Login; 
