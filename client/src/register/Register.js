import React  from 'react'; 
import './Register.scss'
import axios from 'axios';
import qs from 'qs';
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
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                  } else if (error.request){
                      console.log(error.request); 
                  }else {
                      console.log(error.message);
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

        }else {
            document.getElementById("testing").append('Please select the type');
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
                    <input className="RegisterFields" type='text' placeholder='Name' name="nameofuser" onChange={this.handleFormChange}></input>
                </div>

                <div>
                    <input className="RegisterFields" type='text' placeholder='Email' name="email" onChange={this.handleFormChange}></input>
                </div>
                <div >
                    <input className="RegisterFields" type='text' placeholder='Confirm Email' name="emailConfirm" onChange={this.handleFormChange}></input>
                </div>

                <div >
                    <input className="RegisterFields" type='password' placeholder='Password' name="password" onChange={this.handleFormChange}></input>
                </div>
                <div >
                    <input className="RegisterFields" type='password' placeholder='Confirm Password' name="passwordConfirm" onChange={this.handleFormChange}></input>
                </div>
                <div>
                    <div className="TypeofUser">
                        
                        <select value={this.state.typeOfUser} onChange={this.handleSelectOption}>
                            <option value="" name ="typeOfUser"></option>
                            <option value="Student" name ="typeOfUser">Student</option>
                            <option value="Teacher" name ="typeOfUser">Teacher</option>
                        </select>
                    </div>
                    <div id="testing">
                        

                    </div>
                    
   
                </div>

            <div>
                <input type='submit' value='Register' className="RegisterButton"></input>
            </div>
            </form>


        </div>
    )




    }
}


export default Register; 


 /* Might implement later */
/* <input type='button' value='Student' className="RegisterAlternate"></input>
<input type='button' value='Teacher' className="RegisterAlternate1"></input>
*/
