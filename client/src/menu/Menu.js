import React from 'react';
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';

class Menu extends React.Component {
  constructor(props) {
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
    this.userType = this.userType.bind(this);
    this.Logout = this.Logout.bind(this);
  }

  userType() {
    const user = localStorage.getItem('typeOfUser');
    if (user) {
      if (user === 'Teacher') {
        this.state.isStudent = false;
      }
      if (user === 'Student') {
        this.state.isStudent = true;
      }
    }
  }

  Logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('typeOfUser');
    localStorage.setItem('isLoggedIn', false);
  }

  toggleMenu() {
    this.setState({
      isMenuHidden: !this.state.isMenuHidden,
    });
  }

  menuHidden() {
    return (
      <i className="material-icons" onClick={this.toggleMenu}>menu</i>
    );
  }

  menu() {
    return (
      <nav>
        {
					this.state.isStudent ? this.menuStudent() : this.menuProfessor()
				}
        <div className="closeMenu" onClick={this.toggleMenu} />

      </nav>
    );
  }

  menuStudent() {
    return (
      <ul className="menuContainer">
        <li className="listItemMenu">
          <p>{this.state.email}</p>
        </li>
        <li className="listitemmenu">
          <Link to="/student/home">
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
        <li className="listitemmenu">
          <Link to="/">
            <i className="" />
            <p onClick={this.Logout}>Logout</p>
          </Link>
        </li>
      </ul>
    );
  }

  menuProfessor() {
    return (


      <ul className="menuContainer">
        <li className="listItemMenu">
          <p>{this.state.email}</p>
        </li>
        <li className="listitemmenu">
          <Link to="/professor/classes">
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
        <li className="listitemmenu">
          <Link to="/">
            <i className="" />
            <p onClick={this.Logout}>Logout</p>
          </Link>
        </li>
      </ul>
    );
  }


  render() {
    return (
      <div className="header">
        {this.userType()}
        <div className={this.state.isMenuHidden ? 'headerContent-hidden' : 'headerContent'}>
          {
                   this.state.isMenuHidden ? this.menuHidden() : this.menu()
               }
          <h1>
            {' '}
            {this.props.name}
          </h1>
        </div>
      </div>
    );
  }
}

export default Menu;
