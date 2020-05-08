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
            }
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
                <div className="Home">
                    <Menu />
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
