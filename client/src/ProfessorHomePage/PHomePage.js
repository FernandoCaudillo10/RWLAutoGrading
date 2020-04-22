import React  from 'react'; 
import './PHomePage.scss'


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
        
        
        this.ProfessorClasses = this.ProfessorClasses.bind(this);
        this.ViewandEditHandler = this.ViewandEditHandler.bind(this);
        this.CreateAssignmentHandler = this.CreateAssignmentHandler.bind(this); 
    }

    ViewandEditHandler(event){
        //Handler for when they want to edit/review assingments event.target.name gives you the name of the class
        event.preventDefault();
        
    }
    CreateAssignmentHandler(event){
        //Handler for when you want to create an assignment for a class event.target.name gives you the name of the class
       event.preventDefault(); 

    }

    ProfessorClasses(){
        return(
        this.items = this.state.information.map((item, key) =>
                <div key={item.class_id}>
                <h2 className="h2class">{item.ClassName}</h2>
                <div className="buttonFloat">
                
                    <form onSubmit={this.ViewandEditHandler} name={item.ClassName}>
                        <input type="submit" value="View/Edit Assignments" ></input>
                    </form>
                    <form onSubmit={this.CreateAssignmentHandler} name={item.ClassName}>
                        <input type="submit" value="Create Assignment" ></input>
                    </form>
                </div>
                <hr></hr>
                </div>
                    
                
            )
        )
        
    }
 
render(){

    return (
        <div className="professorContainer">
            <h1 className="h1class">Classes</h1>
            <hr></hr>
           {this.ProfessorClasses()}

        </div>  
    )




    }
}


export default ProfessorHomePage; 


