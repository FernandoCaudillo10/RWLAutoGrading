import React  from 'react'; 
import './Submit.scss'


class Submit extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            assignment: "Homework 1", 
            info: [
                {q_num: "1", q_promt: "Ugumogi tarine ogiyib. Ri vozug iepeyeni. Wereta reno rasu tiecirob yu. Ziwon migosis aranun lo orimegil yeceten te egigilo emer rada. Yiegu daseni rire der fe reb te veli. Pelodof xiemic per ehani aperar ater tedie kon sotege co! Lakitie eyi pecig aca nep arayenoc etot coluro meruhe: Repa sen himir ri litere! Memi tog siyebos la bic rege rehihop: Olerelun gilim hala upivatat ri nesude hoterep."},
                {q_num: "2", q_promt: "Ri otatini anereha? Naha cemilu cuga ayipe haleg viras qen cobelies gepip. Sum vogas idiseton tedeson tie odehal me cadi fa padi. Hed yis agav sove terituh rir. Vo ses rureri, iteperot nidip erepe rilo qukope avec, ebi iedare rum. Nome pe dice eneca niy."},
                {q_num: "3", q_promt: "Elolu idonoro sil sone detal lesol hi: Mar coc ecotec reboha ehi. Yavul mi xa; enat oreneser naran da; re otot tecocur ciy sazalan tefarep ciseq, natadon atiyode gieceta obe ade letab ta, tiles ematoy yihi ocuga idicego pa panariv ber wec imepag."},
                {q_num: "4", q_promt: "Nicepuj ranisak lo hira opusila acerur cetamuh gel. Anovu ebeh yesot, ha haha soyeya. Locip ses habe? Hovo oliceleg sietodab sat ilodatan xip ogananod? Ruh ru nasekag roy ro remosoc. Heset net natiser giy nomil cepe. Natiten eren jobo vi. Esec gi niyey onegehe lidi led ace nac hafayec. Pa li opudun rosam ederalip yetat iselidon."},
                {q_num: "5", q_promt: "Lakitie eyi pecig aca nep arayenoc etot coluro meruhe: Repa sen himir ri litere! Memi tog siyebos la bic rege rehihop: Olerelun gilim hala upivatat ri nesude hoterep."},
                {q_num: "6", q_promt: "Siey ral la favelen are ran nie hitil yisebo fa, net meh nate kabie moti dotusat so riehigop isalo, wit ci ateke tiriri osur rod upe. Binu canin rofusi danamol! Cutu capiric irasade lerer nenoy"},

            ]   
        }

        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleFormChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
      }

      handleSubmit(event) {
        event.preventDefault();
    }

    tableBody(){
        return (
            this.table = this.state.info.map((data) => 
                <tr>
                    <td>
                        <b>{data.q_num}) </b>
                        {data.q_promt}<br/><br/>
                        <textarea input type='text' placeholder='Respond Here' onChange={this.handleFormChange}/>
                    </td>
                </tr>
            )
        )
    }

    render(){
        return (

        <div className="Submit">
            <form onSubmit={this.handleSubmit}>
                <div className="title">{this.state.assignment}</div><br/>
                <div>{this.tableBody()}</div>
            </form>
            <input type='submit' value='Submit' className="SubmitButton" />
        </div>
        )
    }
}

export default Submit; 
