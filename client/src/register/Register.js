import React from 'react';
import './Register.scss';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import validator from 'email-validator';
import { connect } from 'react-redux';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailConfirm: '',
      passwordConfirm: '',
      typeOfUser: '',
      nameofuser: '',

    };


    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectOption = this.handleSelectOption.bind(this);
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }


  handleSubmit(event) {
    //   This will handle once you Register
    event.preventDefault();

    const {
      email,
      emailConfirm,
      password,
      passwordConfirm,
      typeOfUser,
      nameofuser,
    } = this.state;
    document.getElementById('ErrorMessagesLogin').innerHTML = '';
    if (email !== emailConfirm) {
      document.getElementById('ErrorMessagesLogin').innerHTML = '';
      document.getElementById('ErrorMessagesLogin').append("Emails don't match");
      return;
    }
    if (password !== passwordConfirm) {
      document.getElementById('ErrorMessagesLogin').innerHTML = '';
      document.getElementById('ErrorMessagesLogin').append("Passwords don't match");
      return;
    }
    const passwordComplexity = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

    if (!validator.validate(email)) {
      document.getElementById('ErrorMessagesLogin').innerHTML = '';
      document.getElementById('ErrorMessagesLogin').append('Invalid email');
      return;
    }

    if (!passwordComplexity.test(password)) {
      document.getElementById('ErrorMessagesLogin').innerHTML = '';
      document.getElementById('ErrorMessagesLogin').append('Passwords must be at least size 6, at least one uppercase, and one number');
      return;
    }

    const { history } = this.props;
    if (typeOfUser === 'Student') {
      axios({
        method: 'post',
        url: 'https://rwlautograder.herokuapp.com/api/stud/cred/register',
        data: qs.stringify({
          name: nameofuser,
          email,
          password,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },

      }).then((res) => {
        if (res.data.message === 'user created successfully') {
          history.push('/');
        }
      }).catch((error) => {
        if (error.response) {
          document.getElementById('ErrorMessagesLogin').innerHTML = '';
          document.getElementById('ErrorMessagesLogin').append('Email already exists');
        }
      });
    } else if (typeOfUser === 'Teacher') {
      axios({
        method: 'post',
        url: 'https://rwlautograder.herokuapp.com/api/prof/cred/register',
        data: qs.stringify({
          name: nameofuser,
          email,
          password,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },

      }).then((res) => {
        if (res.data.message === 'user created successfully') {
          history.push('/');
        }
      }).catch((error) => {
        if (error.response) {
          document.getElementById('ErrorMessagesLogin').innerHTML = '';
          document.getElementById('ErrorMessagesLogin').append('Email already exists');
        }
      });
    } else {
      document.getElementById('ErrorMessagesLogin').innerHTML = '';
      document.getElementById('ErrorMessagesLogin').append('Please select the type');
    }
  }

  handleSelectOption(event) {
    this.setState({ typeOfUser: event.target.value });
  }

  render() {
    const { typeOfUser } = this.state;
    return (
      <div className="Register">


        <h1>Register</h1>


        <form onSubmit={this.handleSubmit}>
          <div>
            <input className="RegisterFields" type="text" placeholder="Name" name="nameofuser" onChange={this.handleFormChange} required />
          </div>

          <div>
            <input className="RegisterFields" type="text" placeholder="Email" name="email" onChange={this.handleFormChange} required />
          </div>
          <div>
            <input className="RegisterFields" type="text" placeholder="Confirm Email" name="emailConfirm" onChange={this.handleFormChange} required />
          </div>

          <div>
            <input className="RegisterFields" type="password" placeholder="Password" name="password" onChange={this.handleFormChange} required />
          </div>
          <div>
            <input className="RegisterFields" type="password" placeholder="Confirm Password" name="passwordConfirm" onChange={this.handleFormChange} required />
          </div>
          <div>
            <div className="TypeofUser">

              <select value={typeOfUser} onChange={this.handleSelectOption} required>
                <option value="Student" name="typeOfUser">Student</option>
                <option value="Teacher" name="typeOfUser">Teacher</option>
              </select>
            </div>

          </div>
          <div id="ErrorMessagesLogin" />

          <div>
            <input type="submit" value="Register" className="RegisterButton" />
          </div>
        </form>

      </div>
    );
  }
}


const mapStatetoProps = (state) => ({
  UserType: state.UserType,
  token: state.token,

});
const mapDispatchToProps = (dispatch) => ({
  onRegister: (token, UserType) => dispatch({ type: 'REGISTER_USER', token, UserType }),
});


Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStatetoProps, mapDispatchToProps)(Register);
