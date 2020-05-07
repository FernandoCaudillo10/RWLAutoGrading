import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import './SSettings.scss'

class SSettings extends React.Component {

    constructor(props){
        super(props);
       
        this.state = {
			uclassName: "",
			rclassName: "",
			register_url: 'https://rwlautograder.herokuapp.com/api/stud/class/register/',
			unregister_url: 'https://rwlautograder.herokuapp.com/api/stud/class/unregister/',
        };
        
        this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormChange(event) {
        this.setState({ [event.target.name]: event.target.value });
	}
      handleSubmit(event) {
		const token = localStorage.getItem("jwtToken")
		var action = ""
		var className = ""
		if(this.state.rclassName !== ""){
			action = this.state.register_url
			className = this.state.rclassName	
		} else if(this.state.uclassName !== ""){
			action = this.state.unregister_url
			className = this.state.uclassName			
		}

		axios({
			method: 'post',
			url: action + className,
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			  'Authorization': token,
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

	render(){ 
		return (
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
					<div> Register for a Class </div>
					<div>
						<input className="LoginFields" type='text' placeholder='Class Name' name="rclassName"  onChange={this.handleFormChange}></input>
					</div>
					<input type='submit' value='Register' className="LoginButton"></input><br/><br/>
					<div> Unregister for a Class </div>
					<div>
						<input className="LoginFields" type='text' placeholder='Class Name' name="uclassName"  onChange={this.handleFormChange}></input>
					</div>
					<input type='submit' value='Unregister' className="LoginButton" ></input>
				</form>
			  

			</div>
				

		)

	}
}
export default SSettings;