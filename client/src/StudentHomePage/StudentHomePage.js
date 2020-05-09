import React  from 'react'; 
    import axios from 'axios';
    import {Link} from "react-router-dom";
    import './StudentHomePage.scss'
    import Menu from '../menu/Menu'; 

    class StudentHomePage extends React.Component{

        constructor(props){
            super(props);
        
            this.state = { 
                studentInfo: [],
                assignments: [],
                newStudent: false,
            }
            this.newStudent = this.newStudent.bind(this);
            this.hidePastDue = this.hidePastDue.bind(this);
            this.tableCall = this.tableCall.bind(this);
            this.tableBody = this.tableBody.bind(this);
            this.getTbl = this.getTbl.bind(this);
        }

        getTbl(classID){
            axios({
                method: 'get',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/' + classID + '/assignment/dates',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': localStorage.getItem("jwtToken"),
                }
            }).then(res => {
                this.setState({ 
                    assignments: this.state.assignments.concat(res.data)
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
                this.state.studentInfo.forEach( i => 
                   this.getTbl(i.class_id)
                )
            }).catch((error) =>{
                this.setState({newStudent: true})
                if(error.response){
                console.log(error.response.data);
                } else if (error.request){
                    console.log(error.request); 
                }else {
                    console.log(error.message);
                }
            })               
        }
    
        hidePastDue(date){
            if(new Date().getTime() < new Date(date).getTime()){
                return new Date(date).toLocaleString() 
            } else {
                return ""
            }
        }

        newStudent(){
            if(this.state.newStudent){
                return(
                    <div className="greeting">
                    <h2><Link to={{pathname: '/student/settings/'}}>Click Here To Register For a Class!</Link></h2><br/>
                    <h3>Have your Section ID Ready!</h3>
                    </div>
                )
            }
            else{
                return this.tableCall()
            }
        }

        tableCall(){
            return(
            <table id="body">
                <th>Assignment</th>
                <th>Initial<br/>Due Date</th>
                <th>Peer Grade <br/>Due Date</th>
                {this.tableBody()}
            </table>
            )
        }
  
        tableBody(){
            return (
                this.table = this.state.assignments.map((data, i) => 
                    <tr>
                        <td><b>Homework {i+1}</b><br/>{<i>{new Date(data.assigned_date).toLocaleString()}</i>}</td>
                        <td><Link to={{pathname: '/student/submit/' + (i+1) , state: {todo: (i+1), rubricID: data.rubric_id}}}>{this.hidePastDue(data.due_date)}</Link></td>
                        <td><Link to={{pathname: '/student/grade/' + (i+1), state: {todo: (i+1), rubricID: data.rubric_id}}}>{this.hidePastDue(data.final_due_date)}</Link></td>
                    </tr>
                )
            )
        }

        render(){
            return (
                <div>
                    <div><Menu /></div>
                    <div className="Home">
                     <div>{this.newStudent()}</div>
                    </div>  
                </div> 
            )
        }
    }

    export default StudentHomePage; 