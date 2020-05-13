import React  from 'react'; 
import './Register.scss'
import axios from 'axios';
import qs from 'qs';
import {connect} from 'react-redux';

class Register extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            email: '',
            password: '',
            emailConfirm: '',
            passwordConfirm: '',
            typeOfUser: '',
            nameofuser: ''
            
        };


        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this); 

    }
    handleFormChange(event) {
       
        this.setState({ [event.target.name]: event.target.value });
      }

    
      handleSubmit(event) {
        //   This will handle once you Register
        event.preventDefault(); 
        document.getElementById("ErrorMessagesLogin").innerHTML = "";
        if(this.state.email !== this.state.emailConfirm){
            document.getElementById("ErrorMessagesLogin").innerHTML = "";
            document.getElementById("ErrorMessagesLogin").append("Emails don't match");
            return;  
        }
        if(this.state.password !== this.state.passwordConfirm){
            document.getElementById("ErrorMessagesLogin").innerHTML = "";
            document.getElementById("ErrorMessagesLogin").append("Passwords don't match");
            return;  
        }
        var passwordComplexity = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");       
        var validator = require("email-validator");
 
        if (!validator.validate(this.state.email)){
            document.getElementById("ErrorMessagesLogin").innerHTML = "";
            document.getElementById("ErrorMessagesLogin").append("Invalid email");
            return; 
        }

        if(!passwordComplexity.test(this.state.password)){
            document.getElementById("ErrorMessagesLogin").innerHTML = "";
            document.getElementById("ErrorMessagesLogin").append("Passwords must be at least size 6, at least one uppercase, and one number");
            return; 
        }

        

       
        
        if(this.state.typeOfUser === "Student"){
            axios({
                method: 'post',
                url: 'https://rwlautograder.herokuapp.com/api/stud/cred/register',
                data: qs.stringify({
                  name: this.state.nameofuser,
                  email: this.state.email,
                  password: this.state.password
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
                
              }).then ( res =>{
                console.log(res);
                console.log(res.data.message)
                if(res.data.message === 'user created successfully'){
                    this.props.history.push('/');
                  }
              }).catch((error) =>{
                  if(error.response){
                      //handles if the user is already created here 
                    console.log(error.response.data);
                    document.getElementById("ErrorMessagesLogin").innerHTML = "";
                    document.getElementById("ErrorMessagesLogin").append("Email already exists");
                  } 
              })

        }else if(this.state.typeOfUser === "Teacher"){
            axios({
                method: 'post',
                url: 'https://rwlautograder.herokuapp.com/api/prof/cred/register',
                data: qs.stringify({
                  name: this.state.nameofuser,
                  email: this.state.email,
                  password: this.state.password
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
                
              }).then ( res =>{
                  if(res.data.message === 'user created successfully'){
                    this.props.history.push('/');
                  }
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                    document.getElementById("ErrorMessagesLogin").innerHTML = "";
                    document.getElementById("ErrorMessagesLogin").append("Email already exists");
                    
                  } 
              })

        }else {
            document.getElementById("ErrorMessagesLogin").innerHTML = "";
            document.getElementById("ErrorMessagesLogin").append('Please select the type');
        }   

      
    }

      handleSelectOption(event){
          this.setState({typeOfUser: event.target.value});
      }
  

render(){

    return (
        <div className='Register'>
         

            <h1>Register</h1>


            <form onSubmit={this.handleSubmit}>
            <div >
                    <input className="RegisterFields" type='text' placeholder='Name' name="nameofuser" onChange={this.handleFormChange} required ></input>
                </div>

                <div>
                    <input className="RegisterFields" type='text' placeholder='Email' name="email" onChange={this.handleFormChange} required></input>
                </div>
                <div >
                    <input className="RegisterFields" type='text' placeholder='Confirm Email' name="emailConfirm" onChange={this.handleFormChange} required></input>
                </div>

                <div >
                    <input className="RegisterFields" type='password' placeholder='Password' name="password" onChange={this.handleFormChange} required></input>
                </div>
                <div >
                    <input className="RegisterFields" type='password' placeholder='Confirm Password' name="passwordConfirm" onChange={this.handleFormChange} required></input>
                </div>
                <div>
                    <div className="TypeofUser">
                        
                        <select value={this.state.typeOfUser} onChange={this.handleSelectOption} required>
                            <option value="" name ="typeOfUser"></option>
                            <option value="Student" name ="typeOfUser">Student</option>
                            <option value="Teacher" name ="typeOfUser">Teacher</option>
                        </select>
                    </div>
                  
                </div>
                <div id="ErrorMessagesLogin">
                       
                       </div>

            <div>
                <input type='submit' value='Register' className="RegisterButton"></input>
            </div>
            </form>

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
        onRegister: (token, UserType) => dispatch({type: 'REGISTER_USER', token: token, UserType: UserType})
    };
};


export default connect(mapStatetoProps, mapDispatchToProps)(Register);