import React  from 'react';
import axios from 'axios';
import './Grade.scss'


class Grade extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            assignment: "Homework 1", 
            info: [
                {q_num: "1", q_resp: "Ugumogi tarine ogiyib. Ri vozug iepeyeni. Wereta reno rasu tiecirob yu. Ziwon migosis aranun lo orimegil yeceten te egigilo emer rada. Yiegu daseni rire der fe reb te veli. Pelodof xiemic per ehani aperar ater tedie kon sotege co! Lakitie eyi pecig aca nep arayenoc etot coluro meruhe: Repa sen himir ri litere! Memi tog siyebos la bic rege rehihop: Olerelun gilim hala upivatat ri nesude hoterep."},
                {q_num: "2", q_resp: "Ri otatini anereha? Naha cemilu cuga ayipe haleg viras qen cobelies gepip. Sum vogas idiseton tedeson tie odehal me cadi fa padi. Hed yis agav sove terituh rir. Vo ses rureri, iteperot nidip erepe rilo qukope avec, ebi iedare rum. Nome pe dice eneca niy."},
                {q_num: "3", q_resp: "Elolu idonoro sil sone detal lesol hi: Mar coc ecotec reboha ehi. Yavul mi xa; enat oreneser naran da; re otot tecocur ciy sazalan tefarep ciseq, natadon atiyode gieceta obe ade letab ta, tiles ematoy yihi ocuga idicego pa panariv ber wec imepag."},
                {q_num: "4", q_resp: "Nicepuj ranisak lo hira opusila acerur cetamuh gel. Anovu ebeh yesot, ha haha soyeya. Locip ses habe? Hovo oliceleg sietodab sat ilodatan xip ogananod? Ruh ru nasekag roy ro remosoc. Heset net natiser giy nomil cepe. Natiten eren jobo vi. Esec gi niyey onegehe lidi led ace nac hafayec. Pa li opudun rosam ederalip yetat iselidon."},
                {q_num: "5", q_resp: "Lakitie eyi pecig aca nep arayenoc etot coluro meruhe: Repa sen himir ri litere! Memi tog siyebos la bic rege rehihop: Olerelun gilim hala upivatat ri nesude hoterep."},
                {q_num: "6", q_resp: "Siey ral la favelen are ran nie hitil yisebo fa, net meh nate kabie moti dotusat so riehigop isalo, wit ci ateke tiriri osur rod upe. Binu canin rofusi danamol! Cutu capiric irasade lerer nenoy"},
            ],
            rubric: [
                {q_num: "1", q_clarity: "1", q_undstd: "1", q_acc: "1"},
                {q_num: "2", q_clarity: "2", q_undstd: "2", q_acc: "2"},
                {q_num: "3", q_clarity: "3", q_undstd: "3", q_acc: "3"},
                {q_num: "4", q_clarity: "4", q_undstd: "4", q_acc: "4"},
                {q_num: "5", q_clarity: "5", q_undstd: "5", q_acc: "5"},
                {q_num: "6", q_clarity: "6", q_undstd: "6", q_acc: "6"}
            ]
        }
       
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);

    }
    handleSliderChange (event) {
        this.setState({value: event.target.value});
    }

    handleFormChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    
    handleSubmit(event) {
        event.preventDefault();                       
    }

    updateSlider = (event) => {
        this.handleSliderChange(event);
        document.getElementById(event.target.id).innerHTML=event.target.value;
        this.setState({ [event.target.name]: event.target.value });
        console.log({ [event.target.name]: event.target.value })
        console.log(this.rubric.q_num)
    }

    tableBody(){
        return (
            this.table = this.state.info.map((data, i) => 
                <tr>
                    <td>
                        <b>{data.q_num}) </b>{data.q_resp}<br/>
                        <table className="gradeTable">
                            <tr>
                                Clarity: <t id={"Clarity:"+data.q_num}>{this.state.rubric[i].q_clarity}  </t>
                                    <input type="range" min="1" max="10" value="5" className="slider" 
                                        id={"Clarity:"+data.q_num} 
                                        value={this.value} 
                                        onChange={this.updateSlider}/>
                            </tr>
                            <tr>
                                Understanding: <t id={"Understand"+data.q_num}>{this.state.rubric[i].q_undstd}</t>
                                    <input type="range" min="1" max="10" value="5" className="slider" 
                                        id={"Understand"+data.q_num} 
                                        value={this.value} 
                                        onChange={this.updateSlider}/>
                            </tr> 
                            <tr>
                                Accuracy: <t id={"Accuracy"+data.q_num}>{this.state.rubric[i].q_acc}</t>
                                    <input type="range" min="1" max="10" value="5" className="slider" 
                                        id={"Accuracy"+data.q_num} 
                                        value={this.value} 
                                        onChange={this.updateSlider}/>
                            </tr>
                        </table>
                    </td>
                </tr>
            )
        )
    }
    render(){
        return (
             <div className="Grade">
            <form onSubmit={this.handleSubmit}>
                <div className="title">{this.state.assignment}</div>
                <div>{this.tableBody()}</div>
                <input type='submit' value='Submit' className="SubmitButton" />
            </form>
        </div>
        )
    }
}

export default Grade; 
