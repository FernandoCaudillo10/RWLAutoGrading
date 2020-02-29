import React from 'react';
import './Login.scss'

const Login = (props) => {
    return (
        <div className="Login">
        {/* <div className="LoginHeader">
        </div> */}
            <h1>Log In</h1>
            <div >
                <input className="LoginFields" type='text' placeholder='Email' id="LogInEmail"></input>
            </div>
            <div>
                <input className="LoginFields" type='password' placeholder='Password' id="LogInPassword"></input>
            </div>
            {/* <div>
                <input type='button' value='Sign In' className="LoginButton"></input>
            </div> */}
            <input type='button' value='Log In' className="LoginButton"></input>


        </div>
            

    )

}

export default Login; 