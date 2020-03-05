import React from 'react';
import './Login.scss'

class Login extends React.Component {

render(){ 
    return (
        <div className="Login">
            <h1>Log In</h1>
            <div >
                <input className="LoginFields" type='text' placeholder='Email' id="LogInEmail"></input>
            </div>
            <div>
                <input className="LoginFields" type='password' placeholder='Password' id="LogInPassword"></input>
            </div>
           
            <input type='button' value='Log In' className="LoginButton"></input>


        </div>
            

    )

}
}
export default Login; 