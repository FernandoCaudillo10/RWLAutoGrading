import React  from 'react';
import './ProfessorAssignments.scss'

class ProfessorAssignments extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            assignmentPrompt: ['Hello'],
            questions: ['Hello']
            
        };
        this.handleSubmitQuestion = this.handleSubmitQuestion.bind(this);
        this.handleSubmitPrompt = this.handleSubmitPrompt.bind(this);
        this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this); 
        this.handleSubmitCancel = this.handleSubmitCancel.bind(this);
    }

    handleSubmitQuestion(event) {
        //   This will handle the add question
        event.preventDefault(); 
        console.log("this was presssed")
      }
      handleSubmitPrompt(event){
          //THis will handle the add prompt button
          event.preventDefault(); 
          console.log("Clicked")
      }

      handleFormChange(event) {
       //Has the assignment text
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
      }

      handleSubmitCreate(event){
        event.preventDefault();
        console.log("Create")

    }
    handleSubmitCancel(event){
        event.preventDefault();
        console.log("Cancel")
    }
   


 
render(){

    return (
        <div className="professorContainer">
            <h3> Create Assignment</h3>
            <form onSubmit={this.handleSubmitQuestion}>
                <textarea placeholder="Enter text here..."  rows="10" cols="30" className="TextBox" name="assignmentPrompt" onChange={this.handleFormChange}></textarea>
                <input type="submit" value="Add Question" id="AddQuestion"/>
            </form>
            
            <h3>Minimum Characters: 20</h3> 
            <form onSubmit={this.handleSubmitPrompt}>
                <input type="submit" value="Add prompt" className="AddPrompt"/>
            </form>
            <div className="CreateandCancel" >
                <form onSubmit={this.handleSubmitCreate}>
                    <input type="submit" value="Create" name="create"/>
                    
                </form>

                <form onSubmit={this.handleSubmitCancel}>
                    <input type="submit" value="Cancel" name="cancel"/>
                </form>
                
            </div>
            
           

        </div>  
    )




    }
}


export default ProfessorAssignments; 


