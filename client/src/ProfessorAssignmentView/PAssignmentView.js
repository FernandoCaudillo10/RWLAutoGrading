import React  from 'react'; 
import './PAssignmentView.scss'

class PAssignmentView extends React.Component{

    constructor(props){
        super(props);     
    
    this.state = {
        assignments: [
            {assignment_name: "Homework 1", due_date: "1/4/2020", ClassName: "CST-399"},
            {assignment_name: "Homework 2", due_date: "2/4/2020", ClassName: "CST-400"},
            {assignment_name: "Homework 3", due_date: "3/4/2020", ClassName: "CST-499"},
            {assignment_name: "Homework 4", due_date: "4/4/2020", ClassName: "CST-599"},
            {assignment_name: "Homework 5", due_date: "5/4/2020", ClassName: "CST-199"}

        ]
    }
    this.ProfessorAssignmnets = this.ProfessorAssignmnets.bind(this);
}

ProfessorAssignmnets(){
    return(
    this.items = this.state.assignments.map((item, key) =>
                <tr key={item.assignment_name}>
                    <td>{item.assignment_name}</td>
                    <td>{item.due_date}</td>
                    <td>{item.ClassName}</td>
                    <td><input type="submit" value="Edit"></input></td>
                </tr>
        )
    )
    
}



render(){

    return (
        <div className="professorContainer">
            <h2 className="h2class">Professor Assignment View</h2>
            <div className="AssignmenViewTable">
            <table>
                <tbody>
                <tr>
                    <td>Assignment Name</td>
                    <td>Due Date</td>
                    <td>Class</td>
                    <td></td>
                </tr>
                 {this.ProfessorAssignmnets()} 
                 </tbody>
            </table>
            </div>
           

        </div>  
    )




    }
}


export default PAssignmentView; 


