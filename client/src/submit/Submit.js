import React  from 'react'; 
import axios from 'axios';
import qs from 'qs'; 
import './Submit.scss'
import Menu from '../menu/Menu'; 

class Submit extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            responses: [],
            assignment: [],
            questions: []
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
                'Authorization': localStorage.getItem("jwtToken"),
            }
        }).then(res => {
            this.setState({ questions: res.data });
            console.log(this.state.questions)
    	})
    }
    
    verifyComplete(){
        console.log(this.state.questions)
        this.state.questions.forEach( e => 
           
            {if (document.getElementById("charNum" + e.q_ID).innerHTML !== 0){
                   // console.log("WRITE SHIT")
                }
            })
    }

    handleSubmit(event) {
        event.preventDefault();

        this.verifyComplete()

            axios({
                method: 'post',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/questions/submit',
                data:  qs.stringify({ 
                    assignment: {responses: this.state.responses}          
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
                        <textarea input type='text' name={data.question_id} placeholder='Respond Here' 
                        onKeyUp={this.countChars.bind(this, (i), data.min_char)} onChange={this.handleFormChange.bind(this, i)}/>
                    </td>
                </tr>
            )
        )
    }

    render(){
        return (
            <div className="Submit">
                <Menu/>
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
