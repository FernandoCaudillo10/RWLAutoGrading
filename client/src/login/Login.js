import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import './Login.scss'
import {connect} from 'react-redux';
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
        this.UserLoggedin = this.UserLoggedin.bind(this);
        this.RedirectRegister = this.RedirectRegister.bind(this); 
        this.UserLoggedin(); 
    }

    RedirectRegister(){
        this.props.history.push('/register');
    }

    UserLoggedin(){
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const typeOfUser = localStorage.getItem("typeOfUser");

      
        if(isLoggedIn && typeOfUser){
            if(isLoggedIn === "true"){
                if(typeOfUser === "Student"){
                    this.props.history.push('/student/home');
                }
                if(typeOfUser === "Teacher"){
                    this.props.history.push('/professor/classes');
                    
                }
            }
        }else{
            return; 
        }
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
            const token = res.data.token; 
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('typeOfUser', this.state.typeOfUser);
            localStorage.setItem('isLoggedIn', true);
            this.props.onLogin(token, 'Student');
            this.props.history.push('/student/home');

			  }).catch((error) =>{
				  if(error.response){
                    console.log(error.response.data);
                    document.getElementById("ErrorMessagesLogin1").innerHTML = "";
                    document.getElementById("ErrorMessagesLogin1").append("Incorrect email or password");
                    console.log(error);
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
                const token = res.data.token; 
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('typeOfUser', this.state.typeOfUser);
                this.props.onLogin(token, 'Teacher');
                this.props.history.push('/professor/classes');
			  }).catch((error) =>{
				  if(error.response){
                    console.log(error.response.data);
                    document.getElementById("ErrorMessagesLogin1").innerHTML = "";
                    document.getElementById("ErrorMessagesLogin1").append("Incorrect email or password");
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
                    <input className="LoginFields" type='text' placeholder='Email' name="email"  onChange={this.handleFormChange} required></input>
                </div>
                <div>
                    <input className="LoginFields" type='password' placeholder='Password' name="password"   onChange={this.handleFormChange} required></input>
                </div>
				<select value={this.state.typeOfUser} onChange={this.handleSelectOption} required>
					<option value="" name ="typeOfUser"></option>
					<option value="Student" name ="typeOfUser">Student</option>
					<option value="Teacher" name ="typeOfUser">Teacher</option>
				</select>

                <input type='submit' value='Log In' className="LoginButton" ></input>
            </form>
            <button onClick={this.RedirectRegister} >Don't have an account? Register</button>

            <div id= "ErrorMessagesLogin1">

                </div>        
           

         

          

        </div>
            

    )

}
}
const mapStatetoProps = state => {
    return {
        UserType: state.UserType,
        token: state.token

    };
};

const mapDispatchToProps = dispatch =>  {
    return {
        onLogin: (token, UserType) => dispatch({type: 'USER_LOGIN', token: token, UserType: UserType})
    };
};





export default connect(mapStatetoProps, mapDispatchToProps)(Login);
