import React from 'react';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Link,
} from 'react-router-dom';

import HomePage from './home/HomePage';
import Login from './login/Login'; 
import Register from './register/Register'; 

import './App.scss';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isStudent: true,
			isMenuHidden: true,
		};

		this.toggleMenu = this.toggleMenu.bind(this);
		this.menu = this.menu.bind(this);
		this.menuHidden = this.menuHidden.bind(this);
		this.menuStudent = this.menuStudent.bind(this);
		this.menuProfessor = this.menuProfessor.bind(this);
	}

	toggleMenu(){
		this.setState({
			isMenuHidden: !this.state.isMenuHidden
		});
	}
	
	menuHidden(){
		return (
			<i className="material-icons" onClick={this.toggleMenu}>menu</i>
		);
	}

	menu(){
		return (
			<nav>
				{
					this.state.isStudent ? this.menuStudent() : this.menuProfessor()
				}
				<div className="closeMenu"onClick={this.toggleMenu}></div>

			</nav>
		);
	}

	menuStudent(){
		return (
				<ul className="menuContainer">
				  <li className="listItemMenu">
				  		<p>JuanDow@csumb.edu</p>
				  </li>
				  <li className="listitemmenu">
					<Link to="/student">
						<i className="material-icons">home</i>
						<p>Home</p>
					</Link>
				  </li>
				  <li className="listitemmenu">
					<Link to="/student/grades">
						<i className="material-icons">assessment</i>
						<p>Grades</p>
					</Link>
				  </li>
				  <li className="listitemmenu">
					<Link to="/student/settings">
						<i className="material-icons">settings</i>
						<p>Settings</p>
					</Link>
				  </li>
				</ul>
			);
	}
	menuProfessor(){
		return (
				<ul className="menuContainer">
				  <li className="listItemMenu">
				  		<p>JuanDow@csumb.edu</p>
				  </li>
				  <li className="listitemmenu">
					<Link to="/professor">
						<i className="material-icons">home</i>
						<p>Home</p>
					</Link>
				  </li>
				  <li className="listitemmenu">
					<Link to="/professor/classes">
						<i className="material-icons">assignment</i>
						<p>Classes</p>
					</Link>
				  </li>
				  <li className="listitemmenu">
					<Link to="/professor/settings">
						<i className="material-icons">settings</i>
						<p>Settings</p>
					</Link>
				  </li>
				</ul>
			);
	}

	render() {
	  return (
		<Router>
			<div>
				 <div className="header">
					<div className={this.state.isMenuHidden?"headerContent-hidden":"headerContent"}>
						{
							this.state.isMenuHidden ? this.menuHidden() : this.menu()
						}
						<h1> Juan Dow </h1>
					</div>
				</div> 

				<Switch>
					<Route exact path ="/" component={Login} />
					<Route exact path ="/register" component={Register} />
					<Route exact path="/professor/classes" component={HomePage} />
					<Route exact path="/professor/settings" component={HomePage} />
					<Route exact path="/student/grades" component={HomePage} />
					<Route exact path="/student/settings" component={HomePage} />
					<Route exact path="/student" component={HomePage} />
					<Route exact path="/professor" component={HomePage} />
				</Switch>
			</div>
		</Router>
	  );
	}
}

export default App;
