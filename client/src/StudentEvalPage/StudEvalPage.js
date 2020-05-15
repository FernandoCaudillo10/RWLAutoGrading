import React from 'react';
import axios from 'axios';
import qs from 'qs';
import RangeSlider from '../RangeSlider/RangeSlider';
import Menu from '../menu/Menu'; 
import './StudEval.scss';

class StudEvalPage extends React.Component {
	constructor(props){
	super(props);
	
	this.state = {
		data: {},
		evalData: null,
	}

	this.renderData = this.renderData.bind(this);
	this.recreateData = this.recreateData.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);

		axios({
                method: 'get',
                url: `https://rwlautograder.herokuapp.com/api/stud/class/${this.props.match.params.rubricID}/assignment/evaluation`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem('jwtToken'),
                }
              }).then ( res => {
				console.log(res);
                {this.recreateData(res.data);}
              }).catch((error) =>{
                  if(error.response){
                    console.log(error.response.data);
                  } else if (error.request){
                      console.log(error.request);
                  }else {
                      console.log(error.message);
                  }
            }).finally(() => { this.forceUpdate() })
	}
	
	postEvaluation = (eArr) => {
		axios({
                method: 'post',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/evaluation/grade/submit',
                data:  qs.stringify({
                    assignment: { evaluation: eArr}
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem("jwtToken"),
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
            }).finally(() => { this.forceUpdate() })

	}

	recreateData(data) {
		var r_data = {};

		data.forEach((idx) => {
			var elem = [], e = {};

			let key = idx.prompt_text;
			let qs = idx.question_text;
			let rID = idx.response_id;
			let rs = idx.response_value;
			let eID = idx.eval_id;			

			e.question = qs;
			e.response = rs;
			e.resID = rID;
			e.eval_id = eID;
			
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
				let evalID = elem[0].eval_id;

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
								<RangeSlider evalID={evalID} type="clarity" callbackFromParent={this.myCallback}/>
							</div>
							<div className="sliderContainer"> 
								<div className="sliderText">
									<b>Grammar:</b>
								</div> 
								<RangeSlider evalID={evalID} type="grammar"/>
							</div>
							<div className="sliderContainer"> 
								<div className="sliderText">
									<b>Response:</b>
								</div> 
								<RangeSlider evalID={evalID} type="response"/>
							</div>
						</div>
				)
			});
			jsxArr.push(pageObj);
		});
	
		return jsxArr;
	}

	handleSubmit(){
		let eArr = [];
		
		Object.entries(this.state.evalData).forEach((elem) => {
			elem[1].map((e, idx) => {
			
				let eObj = {};
				eObj.evaluation_id = e.evaluation_id;
				eObj.grade = e.grade[0];
					
				eArr.push(eObj);
			});
		});
		this.postEvaluation(eArr);
		
	}

	myCallback = (evalData) => {
        this.setState({ evalData: evalData });
    }

	render(){
  		let title = "Peer Student Evaluation";

		return (
			<div><Menu />
            <div className="StudEvalContainer">
                <div id="StudentEvalContainer">
					<h1 id="title"> {title} </h1>
                    {this.renderData()} 
                </div>
				<div>
					<button onClick={this.handleSubmit}>Submit</button>	
				</div>	
            </div>
			</div>
        )
}
}

export default StudEvalPage;
