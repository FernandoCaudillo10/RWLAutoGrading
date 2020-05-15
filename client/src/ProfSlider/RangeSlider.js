import React from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import './RangeSlider.scss';

class RangeSlider extends React.Component {
  static evalObj = {};

  constructor (props) {
    super(props)
    this.state = {
	  value: 50,
    }
  }

  createKeyObj = () => {
	  let key = this.props.evalID;
	  let grades = [0,0,0];
	  let obj = {};
	  
	  obj.evaluation_id = key;
	  obj.grade = grades;

	  RangeSlider.evalObj[key] = [];
	  RangeSlider.evalObj[key].push(obj);
  }

  typeClarity = () => {
	  let key = this.props.evalID;
	  let data;

	  if(key in RangeSlider.evalObj){
		  let data = Object.values(RangeSlider.evalObj[key][0]);
		  data[1][0] = this.state.value;
	  }else{
		  { this.createKeyObj() }
		  { this.typeClarity() }
	  }
  }

  typeGrammar = () => {
	  let key = this.props.evalID;
	  let data;

	  if(key in RangeSlider.evalObj){
		  let data = Object.values(RangeSlider.evalObj[key][0]);
		  data[1][1] = this.state.value;
	  }else{
		  { this.createKeyObj() }
		  { this.typeGrammar() }
	  }
  }

  typeResponse = () => {
	  let key = this.props.evalID;
	  let data;

	  if(key in RangeSlider.evalObj){
		  let data = Object.values(RangeSlider.evalObj[key][0]);
		  data[1][2] = this.state.value;
	  }else{
		  { this.createKeyObj() }
		  { this.typeResponse() }
	  }
  }

  handleChangeStart = () => {
    console.log('Change event started')
  };

  handleChange = value => {
    this.setState({ value: value })
  };

  handleChangeComplete = () => {
    console.log('Change event completed')
	let type = this.props.type;
	if(type === 'clarity') { this.typeClarity() }
	else if(type === 'grammar') { this.typeGrammar() }
	else if(type === 'response') { this.typeResponse() }

	this.props.callbackFromParent(RangeSlider.evalObj);	
  };

render () {
    return (
      <div className='slider'>
        <Slider
          min={0}
          max={100}
          value={this.state.value}
          onChangeStart={this.handleChangeStart}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    )
  }
}

export default RangeSlider;
