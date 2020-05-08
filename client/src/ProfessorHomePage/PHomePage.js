import React  from 'react'; 
import axios from 'axios';
import './PHomePage.scss'
import { Link } from 'react-router-dom';
import Menu from '../menu/Menu';
// RWLAutoGrading/client/src/menu

class ProfessorHomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            information: [
            ]
        }
        
        const token = localStorage.getItem('jwtToken');
        this.ProfessorClasses = this.ProfessorClasses.bind(this);
		
		axios({
			method: 'get',
			url: 'https://rwlautograder.herokuapp.com/api/prof/classes',
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			  'Authorization': token,
			}
		  }).then ( res =>{
		
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

    ProfessorClasses(){
		
        return(
			
        this.items = this.state.information.map((item, key) =>
                <div key={item.class_id}>
                <h2 className="h2class">{item.name}</h2>
                <div className="buttonFloat">
                    <Link to={`/professor/class/${item.class_id}/assignments`}> <input type="submit" value="View/Edit Assignments" ></input> </Link>
                    <Link to={`/professor/class/${item.class_id}/assignment/create`}> <input type="submit" value="Create Assignment" ></input> </Link>
                </div>
                <hr></hr>
                </div>
                    
                
            )
        )
        
    }
 
	render(){
		
		return (
			<div>
			<div>
				<Menu />
			</div>
			<div className="professorContainer">
				<h1 className="h1class">Classes</h1>
				<hr></hr>
			   {this.ProfessorClasses()}

			</div>  
			</div>
		)


    }
}


export default ProfessorHomePage; 


