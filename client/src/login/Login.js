import React from 'react';
import './Login.scss'

class Login extends React.Component {

    constructor(props){
        super(props);
       
        this.state = {
            email: '',
            password: ''
            
        };


        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleFormChange(event) {
       
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
      }

    
      handleSubmit(event) {
        //   This will handle once you submit(click on log in)
        event.preventDefault();
        
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
           
                <input type='submit' value='Log In' className="LoginButton" ></input>
            </form>


        </div>
            

    )

}
}
export default Login; 