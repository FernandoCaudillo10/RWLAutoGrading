import React from 'react';
import axios from 'axios';
import './SGP.scss'
import { Link } from 'react-router-dom';
import Menu from '../menu/Menu'; 

class SGP extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			studentInfo: []
		};

		this.handleFormChange = this.handleFormChange.bind(this);
	}

	handleFormChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	componentDidMount(){
		axios({
			method: 'get',
			url:'https://rwlautograder.herokuapp.com/api/stud/registered/class/info',
			headers: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
				'Authorization': localStorage.getItem("jwtToken"),
			}
		}).then(res => {
			this.setState({ 
				studentInfo: res.data 
			});
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

	tableBody(){
		return (
			this.table = this.state.studentInfo.map((data, i) => 
				<div className="SGP">
					<tr><Link to={{pathname: "/student/home/" + data.section_id + "/assignment/grade"}}>Class: {data.class_id} - Section: {data.section_id}</Link></tr>
				</div>
			)
		)
	}
	render() {
		return (
			<div className="SPG">
				<Menu/>
				<table id="body">
					{this.tableBody()}
				</table>
			</div> 
		)
	}
}
export default SGP;
