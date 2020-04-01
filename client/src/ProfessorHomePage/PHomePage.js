import React  from 'react'; 
import './PHomePage.scss'
import ProfessorClasses from '../ProfessorClasses/ProfessorClasses'; 

class ProfessorHomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            information: [
                {class_id: 1, section_num: 2, ClassName: "CST-399"},
                {class_id: 2, section_num: 2, ClassName: "CST-400"},
                {class_id: 3, section_num: 2, ClassName: "CST-499"},
                {class_id: 4, section_num: 2, ClassName: "CST-599"},
                {class_id: 5, section_num: 2, ClassName: "CST-199"}

            ]   
        }
    }


 
render(){

    return (
        <div className="professorContainer">
            <h1>Classes</h1>
            <hr></hr>
            <ProfessorClasses name={this.state.information[0].ClassName}></ProfessorClasses>
            <ProfessorClasses name={this.state.information[1].ClassName}></ProfessorClasses>
            <ProfessorClasses name={this.state.information[2].ClassName}></ProfessorClasses>

        </div>  
    )




    }
}


export default ProfessorHomePage; 


