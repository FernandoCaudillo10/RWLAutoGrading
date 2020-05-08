import React from 'react';
import axios from 'axios';
import './StudEval.scss';

class StudEvalPage extends React.Component {
	constructor(props){
	super(props);
	
	this.state = {
		data: {},		
	}

	this.renderData = this.renderData.bind(this);
	this.recreateData = this.recreateData.bind(this);

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
              })
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

		this.setState({data: r_data});
		console.log("hello");
		console.log(this.state.data);
	}
	
	renderData() {
		let assign = this.state.data;
		/* 
		return this.state.evaluations.map((evaluation, index) => {
            const { eval_id, prompt_text, question_id, question_text, response_id, response_value } = evaluation
			
			return (
                <tr>
                    <div>
						<text>{question_text}</text><br></br>
						<text>{response_value}</text>
					</div>
					<br></br>
                </tr>
            )
        })		*/
	}

render(){
  	let title = "Professor Student Evalution";

	return (
            <div className="StudGradeContainer">
                <table id="GradeTable">
                    <tbody>
                        <tr>
						HELLo!!!
                         // {this.renderData()} 
                        </tr>
                    </tbody>
                </table>
            </div>
        )
}
}

export default StudEvalPage;
