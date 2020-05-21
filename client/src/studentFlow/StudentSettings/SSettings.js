import React from 'react';
import axios from 'axios';
import qs from 'qs'; 
import Menu from '../../menu/Menu'; 


class SSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      className: '',
      email: '',
      password: '',
      emailConfirm: '',
      passwordConfirm: '',
      name: '',
      uclassName: '',
      rclassName: '',
      register_url: 'https://rwlautograder.herokuapp.com/api/stud/class/register/',
      unregister_url: 'https://rwlautograder.herokuapp.com/api/stud/class/unregister/',

    };

    this.GetUserInfo = this.GetUserInfo.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.GetUserInfo();
  }

  handleSubmit(event) {
    event.preventDefault();
    let action = '';
    let className = '';
    if (this.state.rclassName !== '') {
      action = this.state.register_url;
      className = this.state.rclassName;
    } else if (this.state.uclassName !== '') {
      action = this.state.unregister_url;
      className = this.state.uclassName;
    }
    console.log(action + className);
    axios({
      method: 'post',
      url: action + className,
      data: qs.stringify({
        sectionID: className,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: localStorage.getItem('jwtToken'),
      },
    }).then((res) => {
      console.log(res);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    });
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  GetUserInfo() {
    const token = localStorage.getItem('jwtToken');
    axios({
      method: 'get',
      url: 'https://rwlautograder.herokuapp.com/api/token/verify',
      data: qs.stringify({
      }),
      headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  Authorization: token,
      },
		  }).then((res) => {
      if (res.statusText === 'OK') {
        this.setState({ name: res.data.user.name, email: res.data.user.email });
      }
		  }).catch((error) => {
			  if (error.response) {
        console.log(error.response.data);
			  }
		  });
  }

  handlePasswordChange(event) {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');
    const passwordComplexity = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

    if (this.state.password !== this.state.passwordConfirm) {
      document.getElementById('ErrorMessagesPassword').innerHTML = '';
      document.getElementById('SucessPasswordChange').innerHTML = '';
      document.getElementById('ErrorMessagesPassword').append("Passwords don't match");
      return;
    }

    if (!passwordComplexity.test(this.state.password)) {
      document.getElementById('ErrorMessagesPassword').innerHTML = '';
      document.getElementById('SucessPasswordChange').innerHTML = '';
      document.getElementById('ErrorMessagesPassword').append('Passwords must be at least size 6, at least one uppercase, and one number');
      return;
    }


    axios({
      method: 'put',
      url: 'https://rwlautograder.herokuapp.com/api/stud/cred/update',
      data: qs.stringify({
        password: this.state.passwordConfirm,
        name: this.state.name,
      }),
      headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  Authorization: token,
      },
		  }).then((res) => {
      document.getElementById('ErrorMessagesPassword').innerHTML = '';
      document.getElementById('SucessPasswordChange').innerHTML = '';
      document.getElementById('SucessPasswordChange').append('Sucessfully updated password');
		  }).catch((error) => {
			  if (error.response) {
        console.log(error.response.data);
        document.getElementById('ErrorMessagesEmail').innerHTML = '';
            	document.getElementById('ErrorMessagesEmail').append('Error occurred');
			  }
		  });
  }

  handleNameChange(event) {
    event.preventDefault();
    const token = localStorage.getItem('jwtToken');

    axios({
      method: 'put',
      url: 'https://rwlautograder.herokuapp.com/api/stud/cred/update',
      data: qs.stringify({
        name: this.state.name,
      }),
      headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		 	  Authorization: token,
      },
		  }).then((res) => {
			  console.log(res);
      document.getElementById('SuccessNameChange').innerHTML = '';
      document.getElementById('SuccessNameChange').append('Sucessfully updated name');
		  }).catch((error) => {
			  if (error.response) {
        console.log(error.response.data);
        document.getElementById('ErrorMessagesName').innerHTML = '';
            	document.getElementById('ErrorMessagesName').append('Error occurred');
			  }
		  });
  }

  tableBody() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <br />
          <div> Register for a Class </div>
          <div>
            <input className="LoginFields" type="text" placeholder="Class Name" name="rclassName" onChange={this.handleFormChange} />
          </div>
          <input type="submit" value="Register" className="LoginButton" />
          <br />
          <br />
          <div> Unregister for a Class </div>
          <div>
            <input type="submit" value="Save" className="RegisterButton" />
          </div>

        </form>
        <hr />
        <form onSubmit={this.handleNameChange}>
          <h3>Change Name</h3>
          <div>
            <input className="RegisterFields" type="text" placeholder={this.state.name} name="name" onChange={this.handleFormChange} />
          </div>
          <div id="ErrorMessagesName" />
          <div id="SuccessNameChange" />

          <div>
            <input type="submit" value="Save" className="RegisterButton" />
          </div>

        </form>


        <hr />

        <form onSubmit={this.handlePasswordChange}>
          <h3>Change Password</h3>
          <div>
            <input className="RegisterFields" type="password" placeholder="New Password" name="password" onChange={this.handleFormChange} />
          </div>
          <div>
            <input className="RegisterFields" type="password" placeholder="Confirm Password" name="passwordConfirm" onChange={this.handleFormChange} />
          </div>
          <div id="ErrorMessagesPassword" />
          <div id="SucessPasswordChange" />

          <div>
            <input type="submit" value="Save" className="RegisterButton" />
          </div>
        </form>
      </div>

    // </div>


    );
  }

  render() {
    return (
      <div>
        <div><Menu /></div>
        <div className="Home">
          {this.tableBody()}
        </div>
      </div>
    );
  }
}
export default SSettings;
