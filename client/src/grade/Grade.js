import React from 'react';
import axios from 'axios';
import qs from 'qs';
import './Grade.scss';
import Menu from '../menu/Menu';


class Grade extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluation: [],
      evalInfo: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateSlider = this.updateSlider.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    axios({
      method: 'post',
      url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/evaluation/grade/submit',
      data: qs.stringify({
        assignment: { evaluation: this.state.evaluation },
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

  componentDidMount() {
    	axios({
      method: 'get',
      url: `https://rwlautograder.herokuapp.com/api/stud/class/${this.props.location.state.rubricID}/assignment/evaluation`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: localStorage.getItem('jwtToken'),
      },
    }).then((res) => {
      this.setState({ evalInfo: res.data });
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

  updateSlider(event) {
    const gr = event.target.name;
    this.setState({ [gr]: +event.target.value });
  }

  handleFormChange(i, event) {
    this.updateSlider(event);
    const e = this.state.evaluation;

    e[i] = { evaluationID: event.target.name, grade: +event.target.value };
    this.setState({ e });
  }

  tableBody() {
    return (
      this.table = this.state.evalInfo.map((data, i) => (
        <tr>
          <td>
            <b>
              {(i + 1)}
              )
              {' '}
            </b>
            {data.prompt_text}
            <br />
            <br />
            {data.question_text}
            <br />
            <br />
            {data.response_value}
            <br />
            <br />
            <table className="gradeTable">
              <tr>
                Grade:
                {' '}
                <t name={data.eval_id}>{this.state[data.eval_id]}</t>
                <input
                  name={data.eval_id}
                  type="range"
                  min="1"
                  max="100"
                  value="5"
                  className="slider"
                  value={this.state[data.eval_id]}
                  onChange={this.updateSlider, this.handleFormChange.bind(this, i)}
                />
              </tr>
            </table>
          </td>
        </tr>
      ))
    );
  }

  render() {
    return (
      <div>
        <div><Menu /></div>
        <div className="Grade">
          <form onSubmit={this.handleSubmit}>
            <div className="title">
              Grade Homework
              {this.props.location.state.todo}
            </div>
            <br />
            <div>{this.tableBody()}</div>
            <input type="submit" value="Submit" className="SubmitButton" />
          </form>
        </div>
      </div>
    );
  }
}

export default Grade;
