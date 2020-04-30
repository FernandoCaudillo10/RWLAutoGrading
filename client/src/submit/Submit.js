import React  from 'react'; 
import axios from 'axios';
import './Submit.scss'


class Submit extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            responses: [],
            questions: [{
                        prompt_id: 2,
                        rubric_id: 2,
                        prompt_text: "Good vibes We're bringing only good vibes People walking around talking down on others You can't know yourself without knowing about the other",
                        question_id: 123,
                        question_text: "The day before yesterday, Chris was 7 years old. Next year, hell turn 10. Hows this possible?",
                        min_char: 150
                        },
                        {
                        prompt_id: 2,
                        rubric_id: 2,
                        prompt_text: "Good vibes We're bringing only good vibes People walking around talking down on others You can't know yourself without knowing about the other",
                        question_id: 234,
                        question_text: "There is this one woman who killed her mother. she was born before her father, and married over 100 women without divorcing any one. Yet, she was considered normal by all of his acquaintances. Why?",
                        min_char: 150
                        },
                        {
                        prompt_id: 2,
                        rubric_id: 2,
                        prompt_text: "Good vibes We're bringing only good vibes People walking around talking down on others You can't know yourself without knowing about the other",
                        question_id: 345,
                        question_text: "There is this one woman who killed her mother. she was born before her father, and married over 100 women without divorcing any one. Yet, she was considered normal by all of his acquaintances. Why?",
                        min_char: 150
                    }]
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    countChars(q_ID, minChar, event){
        event.preventDefault(); 
            var strLength = event.target.value.length
            var charRemain = minChar - strLength
            if(charRemain > 0){
                document.getElementById("charNum" + q_ID).innerHTML = charRemain
            } else {
                document.getElementById("charNum" + q_ID).innerHTML = 0
            }        
    }

    handleFormChange(i, event) {
        event.preventDefault() 
            let r = this.state.responses
            r[i] = {response: event.target.value, qsID: event.target.name}
            this.setState({r})
    }

    componentDidMount(){
    	axios({
            method: 'get',
            url: 'https://rwlautograder.herokuapp.com/api/stud/class/' + this.props.location.state.rubricID + '/assignments',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': 'Bearer ela1kd'
            }
        }).then(res => {
    		const questions = res.data;
            this.setState({ questions });
    	})
    }

    handleSubmit(event) {
        event.preventDefault();
            console.log(this.state.responses);
            axios({
                method: 'post',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/questions/submit',
                data:(this.state.responses),
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

    tableBody(){
        return (
            this.table = this.state.questions.map((data, i) => 
                <tr>
                    <td>
                        <b>{(i+1)}) </b>
                        <b1>{data.prompt_text}</b1><br/><br/>
                        <b1>{data.question_text}</b1><br/><br/>
                        <b1>Char Remaining: <b id={"charNum" + (i)}>{data.min_char}</b><br/><br/></b1> 
                        <textarea input type='text' name={'response' + data.question_id} placeholder='Respond Here' 
                        onKeyUp={this.countChars.bind(this, (i), data.min_char)} onChange={this.handleFormChange.bind(this, i)}/>
                    </td>
                </tr>
            )
        )
    }

    render(){
        return (
        <div className="Submit">
            <div className="title">Complete Homework {this.props.location.state.todo}</div><br/>
            <form onSubmit={this.handleSubmit}>
                <div>{this.tableBody()}</div> 
                <input type='submit' value='Submit' className="SubmitButton"/>
            </form>
        </div>
        )
    }
}

export default Submit; 
