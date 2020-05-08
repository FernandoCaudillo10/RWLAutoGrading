import React from 'react';
import axios from 'axios';
import qs from 'qs';
import './SGP.scss'
import { Link } from 'react-router-dom';
import StudentHomePage from '../StudentHomePage/StudentHomePage';

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
			console.log(this.state.studentInfo)
			// this.state.studentInfo.forEach( i => 
			//    this.getTbl(i.class_id)
			// 
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
					<tr>
		<td><Link to={{pathname: "/student/home/" + data.section_id + "/assignment/grade"}}>Class: {data.class_id} - Section: {data.section_id}</Link></td>
					</tr>
				</div>
			)
		)
	}
	render() {
		return (
			<div className="Home">
				<table id="body">
				{this.tableBody()}
				</table>
			</div> 
		)
	}
}
export default SGP;
