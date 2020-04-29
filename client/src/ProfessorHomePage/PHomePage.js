import React  from 'react'; 
import axios from 'axios';
import './PHomePage.scss'


class ProfessorHomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            information: [
                {class_id: 1, name: "CST-399"},
                {class_id: 2, name: "CST-400"},
                {class_id: 3, name: "CST-499"},
                {class_id: 4, name: "CST-599"},
                {class_id: 5, name: "CST-199"}

            ]
        }
        
        
        this.ProfessorClasses = this.ProfessorClasses.bind(this);
        this.ViewandEditHandler = this.ViewandEditHandler.bind(this);
        this.CreateAssignmentHandler = this.CreateAssignmentHandler.bind(this); 
		
		axios({
			method: 'get',
			url: 'https://rwlautograder.herokuapp.com/api/prof/classes',
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			  'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphdmlzaUBnbWFpbC5jb20iLCJ0eXBlIjoicHJvZiIsImlhdCI6MTU4NzcxNTUyMiwiZXhwIjoxNTkwMTM0NzIyfQ.sTG7_BBTurj2pc0QTGuwIDFLRIZpDipx3CHQxocs0Os"
			}
		  }).then ( res =>{
			console.log(res)
			
          	this.setState({information: res.data});
		  }).catch((error) =>{
			  console.log(error);
			  if(error.response){
				console.log(error.response.data);
			  } else if (error.request){
				  console.log(error.request); 
			  }else {
				  console.log(error.message);
			  }
		  })
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
                <h2 className="h2class">{item.name}</h2>
                <div className="buttonFloat">
                
                    <form onSubmit={this.ViewandEditHandler} name={item.name}>
                        <input type="submit" value="View/Edit Assignments" ></input>
                    </form>
                    <form onSubmit={this.CreateAssignmentHandler} name={item.name}>
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


