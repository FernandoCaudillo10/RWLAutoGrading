import React  from 'react'; 
import axios from 'axios';
import qs from 'qs'; 
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import './ProfAssigView.scss';
import Menu from '../menu/Menu'; 

class ProfAssigView extends React.Component{

    constructor(props){
        super(props);
		
		this.state = {
			prompts: {},
		}

		let cId = this.props.match.params.classId;
		let rId = this.props.match.params.rubricId;

		axios({
			method: 'get',
			url: `https://rwlautograder.herokuapp.com/api/prof/class/${cId}/assignment/${rId}`,
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  	  'Authorization': localStorage.getItem('jwtToken'),
			}
		 }).then ( res =>{
			 let prompts = {};
			 for(let i=0; i<res.data.length; i++){
				let e = res.data[i];
				let q1 = {value: e.question_text, min_char: e.min_char };
				let q = {};
				q[e.question_id] = q1;
				if(e.prompt_id in prompts){
					prompts[e.prompt_id].questions[e.question_id] = q1;
				}
				else{
					prompts[e.prompt_id] = {value: e.prompt_text, questions: q};
				}
			 }
			 this.state.prompts = prompts;
		 }).catch((error) =>{
		     if(error.response){
		   	console.log(error.response.data);
		     } else if (error.request){
		   	  console.log(error.request); 
		     }else {
		   	  console.log(error.message);
		     }
		 }).finally( () => {
			this.forceUpdate();
		 });
		
		this.Assignment = this.Assignment.bind(this);
		this.Prompt = this.Prompt.bind(this);
		this.Question = this.Question.bind(this);
	}
	
	Question(pId, qId){
		let question = this.state.prompts[pId].questions[qId];
		return (
			<div key={'q' + qId}>
				<h3> Question: {question.value}</h3>
				<div> Minimum Characters: {question.min_char}</div>
			</div>
		);
	}

	Prompt(pId){
		return (
			<div key={'p' + pId}>
				<h2>Prompt: {this.state.prompts[pId].value}</h2>
				{
					Object.keys(this.state.prompts[pId].questions).map((qId) => {
						return this.Question(pId, qId);
					})
				}
			</div>
		);
	}

	Assignment(){
		return (
			<div>
			{
				Object.keys(this.state.prompts).map((pId) => {
					return this.Prompt(pId);
				})
			}
			</div>
		);
	}

	render(){
		let rId = this.props.match.params.rubricId;
		return (
			<div>
				<Menu />
				<div className="professorContainer">
					<h1> Assignment {rId} </h1>
					{this.Assignment()}
				</div>
			</div>
		)
	}
}

export default ProfAssigView; 
