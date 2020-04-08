import React  from 'react'; 
import './StudentHomePage.scss'


class StudentHomePage extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            info: [
                {todo: "Grade", due_date: "2/1 Mon. 11:59 PM", class_name: "CST-399", assignment: "HW1"},
                {todo: "Submit", due_date: "2/2 Tue. 11:59 PM", class_name: "CST-205", assignment: "HW2"},
                {todo: "Grade", due_date: "2/3 Wed. 11:59 PM", class_name: "CST-340", assignment: "HW3"},
                {todo: "Submit", due_date: "2/4 Thur. 11:59 PM", class_name: "CST-380", assignment: "HW4"},
                {todo: "Grade", due_date: "2/5 Fri. 11:59 PM", class_name: "CST-399", assignment: "HW5"},
            ]   
        }
    }

    tableBody(){
        return (
            this.table = this.state.info.map((data) => 
                <tr onClick={ function() {window.alert(data.assignment)}}>
                    <td><b>{data.todo}</b> {data.assignment}</td>
                    <td>{data.class_name}</td>
                    <td>{data.due_date}</td>
                </tr>
            )
        )
    }
    render(){
        return (
            <div className="Home">
                <table id="body">
                    <th>To-Do</th>
                    <th>Class</th>
                    <th>Due Date</th>
                    {this.tableBody()}
                </table>
            </div>   
        )
    }
}

export default StudentHomePage; 
