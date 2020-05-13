import React  from 'react'; 
import Menu from '../menu/Menu'
import './ProfessorViewAssignment.scss';


class PSingleAssignmentView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            assignmentInfo: [

            ], 
    }

        this.FillInfo = this.FillInfo.bind(this); 
        // this.FillInfo();
        this.state.assignmentInfo = this.props.location.state.info;
     
    }


    FillInfo(){
        return(
            
            this.state.assignmentInfo ? this.state.assignmentInfo.map((item, key) =>
                    <div key={item.question_text} className="StyledSingleAssignmentView">
                        <div>
                            <p>{item.question_text}</p>
                        </div>
                       
                    </div>
                    )
                    : 
                    <div> </div>
            
                
        )
    }

render(){

    return (

        <div>
            <div>
                <Menu />
            </div>
        <div className="professorContainer">
            <p >Prompt: {this.state.assignmentInfo[0].prompt_text}</p>
            <p className="PromptStyle">Assignment Questions:</p>
            {this.FillInfo()}

        </div>  

        </div>
    )
    }
}

export default PSingleAssignmentView; 


