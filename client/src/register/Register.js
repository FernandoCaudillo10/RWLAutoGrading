import React from 'react';
import './Register.scss'


const Register = () =>{

    return (
        <div className='Register'>
            {/* <div className='LoginHeader'>
            </div> */}

            <h1>Register</h1>

            <div>
                <input className="RegisterFields" type='text' placeholder='Email' id="RegisterEmail"></input>
            </div>
            <div >
                <input className="RegisterFields" type='text' placeholder='Confirm Email' id="RegisterEmailConfirm"></input>
            </div>

            <div >
                <input className="RegisterFields" type='password' placeholder='Password' id="RegisterPassword"></input>
            </div>
            <div >
                <input className="RegisterFields" type='password' placeholder='Confirm Password' id="RegisterPasswordConfirm"></input>
            </div>
            <div>
                <input type='button' value='Student' className="RegisterAlternate"></input>
                <input type='button' value='Teacher' className="RegisterAlternate1"></input>
                
                    <div className="RadioButtonCSS">
                        {/* <input type='radio'  id="StudentRegister" name='SelectTypeRegister' value='Student'></input>
                        <label for='Student'>Student</label>
                       
                        
                        <input type='radio' id="TeacherRegister" name='SelectTypeRegister' value='Teacher'></input>
                        <label for='Teacher'>Teacher</label> */}
                    </div>
                    
   
            </div>

            <div>
                <input type='button' value='Register' className="RegisterButton"></input>
            </div>


        </div>
    )




}


export default Register; 