import React from 'react';
// import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';

class Menu extends React.Component {
  static Logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('typeOfUser');
    localStorage.setItem('isLoggedIn', false);
  }

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

  toggleMenu() {
    this.setState((ps) => {
      const { isMenuHidden } = ps;
      return {
        isMenuHidden: !isMenuHidden,
      };
    });
  }

  menuHidden() {
    return (
      <button type="button" onClick={this.toggleMenu} className="clearButton"><i className="material-icons">menu</i></button>
    );
  }

  menu() {
    const { isStudent } = this.state;
    return (
      <nav>
        { isStudent ? this.menuStudent() : this.menuProfessor() }
        <button className="closeMenu" onClick={this.toggleMenu} aria-label="Close Menu" type="button" />
      </nav>
    );
  }

  menuStudent() {
    const { email } = this.state;
    return (
      <ul className="menuContainer">
        <li className="listItemMenu">
          <p>{email}</p>
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
            <button type="button" onClick={Menu.Logout}>Logout</button>
          </Link>
        </li>
      </ul>
    );
  }

  menuProfessor() {
    const { email } = this.state;
    return (
      <ul className="menuContainer">
        <li className="listItemMenu">
          <p>{email}</p>
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
            <button type="button" onClick={Menu.Logout}>Logout</button>
          </Link>
        </li>
      </ul>
    );
  }


  render() {
    const { isMenuHidden } = this.state;
    // const { name } = this.props;
    return (
      <div className="header">
        {this.userType()}
        <div className={isMenuHidden ? 'headerContent-hidden' : 'headerContent'}>
          { isMenuHidden ? this.menuHidden() : this.menu() }
          <h1>
            {/* {name} */}
          </h1>
        </div>
      </div>
    );
  }
}

// Menu.propTypes = {
//   name: PropTypes.string.isRequired,
// };

export default Menu;
