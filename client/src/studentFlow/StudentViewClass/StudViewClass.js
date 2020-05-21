import React from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Menu from '../../menu/Menu';
import './StudViewClass.scss';

class StudViewClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],
    };

    this.renderTableData = this.renderTableData.bind(this);

    axios({
      method: 'get',
      url: 'https://rwlautograder.herokuapp.com/api/stud/registered/class/info',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: localStorage.getItem('jwtToken'),
      },
    }).then((res) => {
               	{ this.setState({ classes: res.data }); }
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

  renderTableData() {
    return this.state.classes.map((c, index) => {
      const {
        class_id, professor_email, name, section_id,
      } = c;
      return (
        <div className="classInfo">
          <text>
            <b>Class ID:</b>
            {' '}
            {class_id}
          </text>
          <br />
          <text>
            <b>Class:</b>
            {' '}
            {name}
          </text>
          <br />
          <text>
            <b>Professor Email:</b>
            {' '}
            {professor_email}
          </text>
          <br />
          <Link id="gradeLink" to={{ pathname: `/student/home/${{ section_id }}/assignment/grade`, state: { sectionID: { section_id } } }}>
            Grades
          </Link>
        </div>
      );
    });
  	}

  render() {
    const title = 'Student Classes';

    return (
      <div>
        <Menu />
        <div className="ViewClassContainer">
          <Menu />
          <h1 id="title">{title}</h1>
          <div id="classes">
            {this.renderTableData()}
          </div>
        </div>
      </div>
    );
  }
}

export default StudViewClass;
