import React from 'react';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import './Submit.scss';
import Menu from '../menu/Menu';

class Submit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      responses: [],
      questions: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyComplete = this.verifyComplete.bind(this);
  }

  componentDidMount() {
    const { location: { state: { rubricID } } } = this.props;
    axios({
      method: 'get',
      url: `https://rwlautograder.herokuapp.com/api/stud/class/${rubricID}/assignments`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: localStorage.getItem('jwtToken'),
      },
    }).then((res) => {
      this.setState({ questions: res.data });
    });
  }

  handleFormChange(i, event) {
    event.preventDefault();
    this.setState((s) => {
      const r = s.responses;
      r[i] = { response: event.target.value, qsID: event.target.name };
      return { responses: r };
    });
  }

  verifyComplete() {
    const { questions } = this.state;
    questions.forEach((data, i) => {
      if (document.getElementById(`charNum${i}`).innerHTML !== 0) {
        document.getElementById(`ErrorMessagesSubmit${i}`).innerHTML = '';
        document.getElementById(`ErrorMessagesSubmit${i}`).append('Please fulfil the character count');
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.verifyComplete();
    const { responses } = this.state;
    axios({
      method: 'post',
      url: 'https://rwlautograder.herokuapp.com/api/stud/class/assignment/questions/submit',
      data: qs.stringify({
        assignment: { responses },
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: localStorage.getItem('jwtToken'),
      },
    });
  }

  tableBody() {
    const { questions } = this.state;
    return (
      questions.map((data, i) => (
        <tr>
          <td>
            <b>
              {(i + 1)}
              )
              {' '}
            </b>
            <b1>{data.prompt_text}</b1>
            <br />
            <br />
            <b1>{data.question_text}</b1>
            <br />
            <br />
            <textarea
              input
              type="text"
              name={data.question_id}
              placeholder="Respond Here"
              onChange={this.handleFormChange.bind(this, i)}
            />
            <div id={`ErrorMessagesSubmit${i}`} />

          </td>
        </tr>
      ))
    );
  }

  render() {
    const { location: { state: { todo } } } = this.props;
    return (
      <div>
        <div><Menu /></div>
        <div className="Submit">
          <div className="title">
            Complete Homework
            {todo}
          </div>
          <br />
          <form onSubmit={this.handleSubmit}>
            <table id="body">{this.tableBody()}</table>
            <input type="submit" value="Submit" className="SubmitButton" />
          </form>
        </div>
      </div>
    );
  }
}

Submit.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      rubricID: PropTypes.string.isRequired,
      todo: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Submit;
