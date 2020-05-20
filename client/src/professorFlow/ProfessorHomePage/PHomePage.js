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
            information: [],
			classToSec: {},
        }
        
        const token = localStorage.getItem('jwtToken');
        this.ProfessorClasses = this.ProfessorClasses.bind(this);
		this.getClassSections = this.getClassSections.bind(this);
		
		axios({
			method: 'get',
			url: 'https://rwlautograder.herokuapp.com/api/prof/classes',
			headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			  'Authorization': token,
			}
		  }).then ( res =>{
          	this.setState({information: res.data});
			this.getClassSections();
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
	
	getClassSections(){
		this.state.information.forEach((info) => {
			axios({
				method: 'get',
				url: 'https://rwlautograder.herokuapp.com/api/prof/class/' + info.class_id,
				headers: {
				  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
				  'Authorization': localStorage.getItem('jwtToken')
				}
			  }).then ( res =>{
				res.data.forEach((section) => {
					if(section.class_id in this.state.classToSec){
						let t = this.state.classToSec;
						t[section.class_id].push(section.section_id);
						this.setState({classToSec: t});
					}
					else{
						let t = this.state.classToSec;
						t[section.class_id] = [section.section_id];
						this.setState({classToSec: t});
					}
				})
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
		})
	}

    ProfessorClasses(){
		
        return(
			
        this.items = this.state.information.map((item, key) =>
                <div key={item.class_id}>
					<div className="professorClassSecBody">
						<h2 className="h2class">{item.name}</h2>
						<h4 className="h2class"> Sections: 
							{this.state.classToSec[item.class_id] ? 
								" " +this.state.classToSec[item.class_id].map(
									(sec_id, i) => {
										if(i+1 === this.state.classToSec[item.class_id].length) return sec_id;
										else return sec_id + ", ";
									} ) 
							: <span> </span>} 
						</h4>
						<div>
							<div>
								<Link to={`/professor/class/${item.class_id}/assignments`}> <input type="submit" value="View/Edit Assignments" ></input> </Link>
								<Link to={`/professor/class/${item.class_id}/assignment/create`}> <input type="submit" value="Create Assignment" ></input> </Link>
							</div>
						</div>
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


