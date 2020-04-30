import React  from 'react';
import axios from 'axios';
import './Grade.scss'


class Grade extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {

            evaluation: [ 
                        {evaluationID:  9, grade: 80 },
                        {evaluationID:  10, grade: 99},
                        {evaluationID: 11, grade: 69}
            ],    
            evalInfo:  [{
                    eval_id: 1,
                    prompt_text: "LETS judge a book by the cover People take a look at the world and discover That beauty is the word that I think of when I see the different colors of skin And Ill rejoice and sing for them",
                    question_id: 1,
                    question_text: "What is the one thing that all wise men, regardless of their religion or politics, agree is between heaven and earth?",
                    response_id: 1,
                    response_value: "The US Senate passed a massive, $2 trillion stimulus package late Wednesday night"
                    },
                    {
                    eval_id: 2,
                    prompt_text: "Dont judge a book by the cover People take a look at the world and discover That beauty is the word that I think of when I see the different colors of skin And Ill rejoice and sing for them",
                    question_id: 2,
                    question_text: "What is the one thing that all wise men, regardless of their religion or politics, agree is between heaven and earth?",
                    response_id: 1,
                    response_value: "The US Senate passed a massive, $2 trillion stimulus package late Wednesday night"
                    },
                    {
                    eval_id: 8,
                    prompt_text: "Good vibes Were bringing only good vibes People walking around talking down on others You cant know yourself without knowing about the other",
                    question_id: 4,
                    question_text: "There is this one man who killed his mother. He was born before his father, and married over 100 women without divorcing any one. Yet, he was considered normal by all of his acquaintances. Why?",
                    response_id: 8,
                    response_value: "In New York, the epicenter of the COVID-19 outbreak in the U.S., Gov"
                    }]
        }
       
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);

    }
    handleSliderChange (event) {
        this.setState({value: event.target.value});
    }
    
    handleFormChange(q_ID, e_ID, event) {
        let p = this.state.evaluation[q_ID - 1]
        p.evaluationID = e_ID
        p.grade = Number(event.target.value)
        this.setState({p})
    }

    handleSubmit(event) {
        event.preventDefault();   
        console.log(this.state.evaluation)  
        axios({
            method: 'post',
            url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/evaluation/grade/submit',
            data:(this.state.evaluation),
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
              'Authorization': 'Bearer ela1kd'
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

    componentDidMount(){
    	axios({
            method: 'get',
            url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/evaluation'
        }).then(res => {
    		const evalInfo = res.data;
    		this.setState({ evalInfo });
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

    updateSlider = (event) => {
        this.handleSliderChange(event);
        document.getElementById(event.target.id).innerHTML=event.target.value
    }

    tableBody(){
        return (
            this.table = this.state.evalInfo.map((data, i) => 
                <tr>
                    <td>
                        <b>{(i+1)}) </b>
                        {data.prompt_text}<br/><br/>
                        {data.question_text}<br/><br/>
                        {data.response_value}<br/><br/>
                        <table className="gradeTable">
                            <tr>
                                Grade: <t id={(i+1)}>{this.state.evaluation[i].grade}</t>
                                    <input type="range" min="1" max="100" value="5" className="slider" 
                                        id={(i+1)} 
                                        value={this.value} 
                                        onChange={this.updateSlider, this.handleFormChange.bind(this, (i+1), data.eval_id)}/>
                            </tr>
                        </table>
                    </td>
                </tr>
            )
        )
    }
    render(){
        return (
             <div className="Grade">
            <form onSubmit={this.handleSubmit}>
                <div className="title">Grade Homework {this.props.location.state.todo}</div><br/>
                <div>{this.tableBody()}</div>
                <input type='submit' value='Submit' className="SubmitButton" />
            </form>
        </div>
        )
    }
}

export default Grade; 
