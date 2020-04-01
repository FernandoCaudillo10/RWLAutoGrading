import React  from 'react'; 


class ProfessorClasses extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            information: [
                {class_id: 1, section_num: 2, className: ""},
                {class_id: 2, section_num: 2, className: ""},
                {class_id: 3, section_num: 2, className: ""},
                {class_id: 4, section_num: 2, className: ""},
                {class_id: 5, section_num: 2, className: ""}

            ]

            
        }
       
        this.formFillerHandler = this.formFillerHandler.bind(this);
     
    }


   formFillerHandler(event){
        event.preventDefault();
        console.log("hello")
       
   }

render(){

    return (
        <div>
            <div>
                <h2>{this.props.name}</h2>
                <div className="sectionButton">
                    <p>Section 1</p>
                    <div className="buttonFloat">
                        <form onSubmit={this.formFillerHandler}>
                            <input type="submit" value="View/Edit Assignments" ></input>
                        </form>
                    </div>

                </div>
                <div className="sectionButton">
                    <p>Section 2</p>
                    <div  className="buttonFloat">
                        <form onSubmit={this.formFillerHandler}>
                            <input type="submit" value="View/Edit Assignments" ></input>
                        </form>
                        
                    </div>

                </div>
                <div className="sectionButton">
                    <p>Section 3</p>
                    <div  className="buttonFloat">
                        <form onSubmit={this.formFillerHandler}>
                            <input type="submit" value="View/Edit Assignments" ></input>
                        </form>
                    </div>

                </div>
                <hr></hr>
                
                
                
                
               
             
            </div>
           

        </div>  
    )




    }
}


export default ProfessorClasses; 


