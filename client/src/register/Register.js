import React  from 'react'; 
import './Register.scss'


class Register extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            email: '',
            password: '',
            emailConfirm: '',
            passwordConfirm: '',
            typeOfUser: ''
            
        };


        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this); 

    }

    handleFormChange(event) {
       
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
      }

    
      handleSubmit(event) {
        //   This will handle once you Register
        event.preventDefault(); 
      }

      handleSelectOption(event){
          this.setState({typeOfUser: event.target.value});
          console.log(event.target.value);

      }
  

render(){

    return (
        <div className='Register'>
         

            <h1>Register</h1>


            <form onSubmit={this.handleSubmit}>

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