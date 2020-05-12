import React from 'react';
import axios from 'axios';
import RangeSlider from '../RangeSlider/RangeSlider';
import './StudEval.scss';

class StudEvalPage extends React.Component {
	constructor(props){
	super(props);
	
	this.state = {
		Ddata: [
    {
        "eval_id": 1,
        "prompt_text": "judge a book by the cover",
        "question_id": 1,
        "question_text": "he was considered normal by all of his acquaintances. Why?",
        "response_id": 1,
        "response_value": "The US Senate has good taste."
    },
    {
        "eval_id": 2,
        "prompt_text": "judge a book by the cover",
        "question_id": 2,
        "question_text": "all of his acquaintances. Why?",
        "response_id": 2,
        "response_value": "The US has good taste."
    },
    {
        "eval_id": 3,
        "prompt_text": "Good vibes Were bringing only good vibes People",
        "question_id": 3,
        "question_text": "considered normal Why?",
        "response_id": 3,
        "response_value": "Congress, tho"
    }],	
		data: {},	
	}

	this.renderData = this.renderData.bind(this);
	this.recreateData = this.recreateData.bind(this);
/*
		axios({
                method: 'get',
                url: `https://rwlautograder.herokuapp.com/api/stud/class/${this.props.match.params.rubricID}/assignment/evaluation`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem('jwtToken'),
                }
              }).then ( res => {
                {this.recreateData(res.data);}
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                  } else if (error.request){
                      console.log(error.request);
                  }else {
                      console.log(error.message);
                  }
              })*/
		this.recreateData(this.state.Ddata);
	}

	recreateData(data) {
		var r_data = {};

		data.forEach((idx) => {
			var elem = [], e = {};

			let key = idx.prompt_text;
			let qs = idx.question_text;
			let rID = idx.response_id;
			let rs = idx.response_value;

			e.question = qs;
			e.response = rs;
			e.resID = rID;
			
			elem.push(e);

			if(key in r_data) {
				r_data[key].push(elem);	
			} else { 
				r_data[key] = [];
				r_data[key].push(elem); 
			}
		})

		this.state.data = r_data;
	}
	
	renderData() {
		let assign = this.state.data;
		let pageObj;
		let jsxArr = [];
		
		Object.entries(assign).forEach((arr) => {
			let prompt = arr[0];
			jsxArr.push(<div id="prompt">
							<text><b>{prompt}</b></text>
						</div>)
			pageObj = arr[1].map((elem, idx) => {
				let qs = elem[0].question;
				let res = elem[0].response;
			
				return (
						<div>
							<div className="assignInfo">
								<text> {qs} </text><br></br>
								<text id="response"> {res} </text><br></br>
							</div>
							<div className="sliderContainer"> 
								<div className="sliderText">
									<b>Clarity:</b>
								</div> 
								<RangeSlider />
							</div>
							<div className="sliderContainer"> 
								<div className="sliderText">
									<b>Grammar:</b>
								</div> 
								<RangeSlider />
							</div>
							<div className="sliderContainer"> 
								<div className="sliderText">
									<b>Response:</b>
								</div> 
								<RangeSlider />
							</div>
						</div>
				)
			});
			jsxArr.push(pageObj);
		});
	
		return jsxArr;
	}

render(){
  	let title = "Professor Student Evaluation";

	return (
            <div className="StudEvalContainer">
                <div id="StudentEvalContainer">
					<h1 id="title"> {title} </h1>
                    {this.renderData()} 
                </div>
            </div>
        )
}
}

export default StudEvalPage;
