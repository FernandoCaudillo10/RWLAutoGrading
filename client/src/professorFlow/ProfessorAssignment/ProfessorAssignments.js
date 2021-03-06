import React from 'react';
import axios from 'axios';
import qs from 'qs';
import './ProfessorAssignments.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/core';
import BeatLoader from 'react-spinners/BeatLoader';
import dateFormat from 'dateformat';
import Menu from '../../menu/Menu'; 

class ProfessorAssignments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
			prompts : {},
			psz: 0,
			assigned_date: Date.now(),
			due_date: Date.now(),
			final_due_date: Date.now(),
			ass_name: "",
			loading: false,
        };

        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleAddPrompt = this.handleAddPrompt.bind(this);
        this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this); 
		this.AssignmentView = this.AssignmentView.bind(this);
		this.convertToAssignment = this.convertToAssignment.bind(this);
		this.setAssignedDate = this.setAssignedDate.bind(this);
		this.setDueDate = this.setDueDate.bind(this);
		this.setFinalDueDate = this.setFinalDueDate.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleAddQuestion(event, pId) {
        event.preventDefault(); 
		  let p = this.state.prompts;
		  p[pId].questions[p[pId].qsz] = {question: "", min_char: 0};
		  p[pId].qsz += 1;
		  this.setState({ prompts: p });
  }

  handleAddPrompt(event) {
    event.preventDefault();
		  const p = this.state.prompts;
		  let { psz } = this.state;
		  p[this.state.psz] = { qsz: 0, prompt: '', questions: {} };
		  this.setState({ psz: ++psz, prompts: p });
  }

  handleFormChange(event, pId, qId) {
    // Has the assignment text
	   if (qId) {
		   	const p = this.state.prompts;
      p[pId].questions[qId].question = event.target.value;
        	this.setState({ prompts: p });
	   } else if (pId) {
		   	const p = this.state.prompts;
      p[pId].prompt = event.target.value;
        	this.setState({ prompts: p });
	   }
  }

  convertToAssignment() {
    const p = Object.values(this.state.prompts);
    p.forEach((prompt) => { prompt.questions = Object.values(prompt.questions); });
    return p;
  }

  handleSubmitCreate(event) {
    const token = localStorage.getItem('jwtToken');
    event.preventDefault();
    if (this.state.ass_name === '') {
      console.log('here');
      document.getElementById('ErrorMessagesCreateAssignment').innerHTML = '';
      document.getElementById('ErrorMessagesCreateAssignment').append('Please give the assignment a name');
      return;
    }
    this.setState({
      loading: true,
    });
    const assignment = { prompts: this.convertToAssignment() };
    axios({
      method: 'post',
      url: `https://rwlautograder.herokuapp.com/api/prof/class/${this.props.match.params.classId}/assignment/create`,
      data: qs.stringify({
        assignment,
        due_date: new Date(this.state.due_date),
        assigned_date: new Date(this.state.assigned_date),
        final_due_date: new Date(this.state.final_due_date),
        assignment_name: this.state.ass_name,
      }),
      headers: {
			  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
		  	  Authorization: localStorage.getItem('jwtToken'),
      },
		  }).then((res) => {
			  this.setState({ loading: false });
			  this.props.history.push('/professor/classes');
		  }).catch((error) => {
			  this.setState({ loading: false });
			  if (error.response) {
        console.log(error.response.data);
        console.log(error.response.data.error);
        document.getElementById('ErrorMessagesCreateAssignment').innerHTML = '';
        document.getElementById('ErrorMessagesCreateAssignment').append('Please add at least 1 prompt and 1 question');
			  }
		  });
  }

  Question(pId, qId) {
    return (
      <div key={`q${qId}`} className="questionDiv">
        <h4>
          Question
          {+qId + 1}
        </h4>
        <textarea placeholder="Enter text here..." className="TextBox" name={`${pId}q${qId}`} onChange={(e) => this.handleFormChange(e, pId, qId)} />
        <h5>Minimum Characters Required: 1</h5>
      </div>
    );
  }

  Prompt(pId) {
    return (
      <div key={`p${pId}`} className="promptDiv">
        <h4>
          Prompt
          {+pId + 1}
        </h4>
        <textarea placeholder="Enter text here..." className="TextBox promptTextBox" name={`p${pId}`} onChange={(e) => this.handleFormChange(e, pId)} />
        { this.state.prompts[pId] ? Object.keys(this.state.prompts[pId].questions).map((qId) => { if (qId !== 'qsz' && qId !== 'prompt') return this.Question(pId, qId); }) : <div /> }
        <input type="submit" onClick={(e) => this.handleAddQuestion(e, pId)} value="Add Question" className="AddQuestion" />
      </div>
    );
  }

  AssignmentView() {
    return (
      <form onSubmit={this.handleAddQuestion}>
        { Object.keys(this.state.prompts).map((pId) => { if (pId !== 'psz') return this.Prompt(pId); }) }
        <input type="submit" onClick={this.handleAddPrompt} value="Add Prompt" className="AddPrompt" />
      </form>
    );
  }

  setAssignedDate(date) {
    this.setState({ assigned_date: date });
  }

  setDueDate(date) {
    this.setState({ due_date: date });
  }

  setFinalDueDate(date) {
    this.setState({ final_due_date: date });
  }

  handleNameChange(event) {
    this.setState({ ass_name: event.target.value });
    console.log(this.state.ass_name);
  }

  render() {
    return (
      <div>
        <div>
          <Menu />
        </div>
        <div className="professorContainer">
          <h3> Create Assignment</h3>
          <h4> Assignment Name </h4>
          <input type="text" value={this.state.ass_name} onChange={this.handleNameChange} />
          <div className="datePickerContainer">
            <div>
              <h4> Assigned Date </h4>
              <DatePicker
                selected={this.state.assigned_date}
                onChange={this.setAssignedDate}
                minDate={Date.now()}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div>
              <h4> Submission Due Date </h4>
              <DatePicker
                selected={this.state.due_date}
                onChange={this.setDueDate}
                minDate={Date.now()}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div>
              <h4> Peer Grading Due Date </h4>
              <DatePicker
                selected={this.state.final_due_date}
                onChange={this.setFinalDueDate}
                minDate={Date.now()}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
          </div>

          {this.AssignmentView()}

          { this.state.loading
            ? (
              <div className="loadingContainer">
                <h4> Sending Information </h4>
                <BeatLoader
                  loading={this.state.loading}
                />
              </div>
            )
            :				(
              <div className="CreateandCancel">
                <form onSubmit={this.handleSubmitCreate}>
                  <input type="submit" value="Create" name="create" />
                </form>
              </div>
            )}
          <div id="ErrorMessagesCreateAssignment" />

        </div>

      </div>
    );
  }
}


export default ProfessorAssignments;
