import React  from 'react'; 
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import './StudentHomePage.scss'


class StudentHomePage extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            studentInfo: [{
                class_id: 1,
                professor_email: "",
                name: "",
            }],  
            test: [
                {
                    rubric_id: 100,
                    assigned_date: "2020-04-21T07:00:00.000Z ",
                    due_date: "2020-04-28T07:00:00.000Z",
                    final_due_date: "2020-05-01T07:00:00.000Z ",
                    section_id: 1 
                },
                {
                    rubric_id: 200,
                    assigned_date: "2020-04-21T07:00:00.000Z ",
                    due_date: "2020-04-28T07:00:00.000Z",
                    final_due_date: "2020-05-01T07:00:00.000Z ",
                    section_id: 1 
                }
            ],
            isHovered: false 
        }
        
        this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover(){
        this.setState(prevState => ({isHovered: !prevState.isHovered}));
    }


    componentDidMount(){
    	axios({
            method: 'get',
            url:'https://rwlautograder.herokuapp.com/api/stud/registered/class/info'
        }).then(res => {
    		const studentInfo = res.data;
            this.setState({ studentInfo });
            console.log(this.state.studentInfo)
        }).catch((error) =>{
            if(error.response){
              console.log(error.response.data);
            } else if (error.request){
                console.log(error.request); 
            }else {
                console.log(error.message);
            }
        })

        axios({
            method: 'get',
            url: 'https://rwlautograder.herokuapp.com/api/stud/class/' + this.state.studentInfo[0].class_id + '/assignment/dates'
        }).then(res => {
            const test = res.data;
            this.setState({ test });
            console.log(this.state.test)
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
            this.table = this.state.test.map((data, i) => 
                <tr>
                      <td><div onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}><b>Homework {i+1}</b><br/>{this.state.isHovered ? "" : <i>{data.assigned_date}</i> }</div></td>
                      <td><Link to={{pathname: '/student/submit/' + (i+1) , state: {todo: (i+1), rubricID: data.rubric_id}}}>{data.due_date}</Link></td>
                      <td><Link to={{pathname: '/student/grade/' + (i+1), state: {todo: (i+1), rubricID: data.rubric_id}}}>{data.final_due_date}</Link></td>
                </tr>
            )
            
        )
    }

    render(){
        return (
            <div className="Home">
                <table id="body">
                    <th>Assignment</th>
                    <th>Initial<br/>Due Date</th>
                    <th>Peer Grade <br/>Due Date</th>
                    {this.tableBody()}
                </table>
            </div>   
        )
    }
}

export default StudentHomePage; 
