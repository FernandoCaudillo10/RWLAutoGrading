import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import './PSettings.scss'

class PSettings extends React.Component {

    constructor(props){
        super(props);
       
        this.state = {
			className: "",
        };
        
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    
      handleFormChange(event) {
        this.setState({ [event.target.name]: event.target.value });
      }
    
      handleSubmit(event) {
        event.preventDefault();
		
		axios({
			method: 'post',
			url: 'https://rwlautograder.herokuapp.com/api/prof/class/create',
			data: qs.stringify({
			  name: this.state.className,
			}),
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			  'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphdmlzaUBnbWFpbC5jb20iLCJ0eXBlIjoicHJvZiIsImlhdCI6MTU4NzcxNTUyMiwiZXhwIjoxNTkwMTM0NzIyfQ.sTG7_BBTurj2pc0QTGuwIDFLRIZpDipx3CHQxocs0Os"
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
					<div> Create Class </div>
					<div>
						<input className="LoginFields" type='text' placeholder='Class Name' name="className"  onChange={this.handleFormChange}></input>
					</div>

					<input type='submit' value='Log In' className="LoginButton" ></input>
				</form>
			  

			</div>
				

		)

	}
}
export default PSettings;
