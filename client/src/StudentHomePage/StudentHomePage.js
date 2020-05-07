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
                studentInfo: [],
                assignments: [],
                isHovered: false 
            }
            this.toggleHover = this.toggleHover.bind(this);
            this.getTbl = this.getTbl.bind(this);
        }

        toggleHover(){
            this.setState(prevState => ({isHovered: !prevState.isHovered}));
        }

        getTbl(classID){
            const token = localStorage.getItem("jwtToken")
            axios({
                method: 'get',
                url: 'https://rwlautograder.herokuapp.com/api/stud/class/' + classID + '/assignment/dates',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': token,
                }
            }).then(res => {
                this.setState({ 
                    assignments: res.data
                });
                console.log(this.state.assignments)
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
            const token = localStorage.getItem("jwtToken")

            axios({
                method: 'get',
                url:'https://rwlautograder.herokuapp.com/api/stud/registered/class/info',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': token,
                }
            }).then(res => {
                this.setState({ 
                    studentInfo: res.data 
                });
                this.state.studentInfo.forEach( i => 
                    this.getTbl(i.section_id)
                )
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
        }
    
        tableBody(){
            return (
                this.table = this.state.assignments.map((data, i) => 
                    <tr>
                        <td><div onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}><b>Homework {i+1}</b><br/>{this.state.isHovered ? "" : <i>{new Date(data.assigned_date).toLocaleString()}</i> }</div></td>
                        <td><Link to={{pathname: '/student/submit/' + (i+1) , state: {todo: (i+1), rubricID: data.rubric_id}}}>{new Date(data.due_date).toLocaleString()}</Link></td>
                        <td><Link to={{pathname: '/student/grade/' + (i+1), state: {todo: (i+1), rubricID: data.rubric_id}}}>{new Date(data.final_due_date).toLocaleString()}</Link></td>
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
