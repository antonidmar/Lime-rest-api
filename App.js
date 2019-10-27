import React, { Component } from "react";
import "./App.css";
import axios from "axios";




// const url ="http://localhost:3001/api/lime";
// const response =  fetch(url, {
//      method: "GET", // *GET, POST, PUT, DELETE, etc.
//      cors: 'no-cors',
//      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//      headers: {
//       "Content-Type": "application/hal+json",
//       "x-api-key": apiKey
//      // 'Content-Type': 'application/x-www-form-urlencoded',
// }});
//creating a const for the proxy-server and the standard way into the API.
const PROXY_URL = "http://localhost:3001/api/lime/"
const API_URL = "https://api-test.lime-crm.com/api-test/api/v1/"




//Giving all the parameters that's later gonna be my "keyvalues" a value so that I can change the state later.
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      average: 0,
      averagePerMonth: 0,
      companies: 0,
      customersWonDeal: {},
      next: '',
      limers: []
    };
  }

  //Getting the specific data thaht i'm searching for and setting the state for my functions. 
  fetchLimeObjects(url, params) {
    axios
      .get(
        url + '?' + params
      )
      .then(response => {
        console.log(response.data);
        const currentLimers = this.state.limers;
        const newLimers = response.data._embedded.limeobjects;
        const [url, newParams] = response.data._links.next.href.split('?')
        console.log(newParams);
        const [_, value] = newParams.split('=');
        const nextParams = params.replace(/(_offset=\d+&)?/,'_offset=' + value + '&' );
        const limers = [...currentLimers, ...newLimers];
        this.setState({
          average: this.averageDealValue(limers),
          averagePerMonth: this.averageDealValuePerMonth(limers),
          companies: this.companies(limers),
          customersWonDeal: this.companiesWonDeals(limers),
          limers,
          next: url.replace(API_URL, PROXY_URL) + "?" + nextParams
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  //Get the array limeobject and filter so that I just get the closeddate == 2018, and then map them to the their value, returning all the values and splittning them witb 12.
  averageDealValue(data){
    const deals = 
      data.filter(deal => {
        const closedDate = new Date(deal.closeddate);
        return closedDate.getFullYear() === 2018
      }).map(deal => deal.value);
      return deals.reduce((acc, next) => acc + next)/deals.length
  }

  averageDealValuePerMonth(data){
    const deals = 
    data.filter(deal => {
      const closedDate = new Date(deal.closeddate);
      return closedDate.getFullYear() === 2018
    }).map(deal => deal.value);
    return deals.reduce((acc, next) => acc + next)/deals.length/12
  }

  companies(data){
    const deals = 
    data.filter(deal => {
      const closedDate = new Date(deal.closeddate);
      return closedDate.getFullYear() === 2018
      }).map(deal => deal.company )
      return deals + ','
    }



  companiesWonDeals(data) {
    const deals =
    data.filter(deal => {
      const closedDate = new Date(deal.closeddate);
      return closedDate.getFullYear() === 2018
    }).map(deal => ({
      value: deal.value, 
      company: deal.company
    })).reduce((acc, next) => {
      const currentCompanyValue = acc[next.company] || 0;
      acc[next.company] = next.value + currentCompanyValue;
      return acc;
    },{});
    return deals 
  }

  //this function is gonna work so we can get more than the first 10 from the limeobjects.
  onLoadMore(event){
    const [url, params] = this.state.next.split('?')
    this.fetchLimeObjects(url, params)
  }
  //After all the elements of the page is rendered correctly, this method is called. After the markup is set on the page, this technique called by React itself to either fetch the data from An External API or perform some unique operations which need the JSX elements.
  componentDidMount() {
    this.fetchLimeObjects("http://localhost:3001/api/lime/limeobject/deal/",
     "_limit=10&_sort=-closeddate&_embed=company") 
    // axios
    //   .get(
    //     "http://localhost:3001/api/lime/limeobject/deal/?_limit=10&_sort=-closeddate&_embed=company"
    //   )
    //   .then(response => {
    //     console.log(response.data);
    //     this.setState({
    //       limers: response.data._embedded.limeobjects,
    //       next: response.data._links.next.href
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

 

  render() {
    const { limers, average, averagePerMonth, companies, customersWonDeal } = this.state;
    return ( 
      //Strucutirng and visualizing the data
        <div className="App">
          <div className="header">
            <h1>Dream Team</h1>
            <p>- "Making dreams become reality"</p>
          </div>

        <div class="row">
          <div class="column"> 
            <div class="card1">
              <h2>Average deal value for won deals 2018:</h2>
              <h3> {average}:- </h3></div>
          </div>
          <div class="column">
            <div class="card2">
              <h2>Average deal value per month 2018:</h2>
              <h3>{ averagePerMonth }:-</h3></div>
          </div>
          <div class="column">
            <div class="card3"><h2>Company-ID</h2>
              <li><h3>{ companies }</h3></li></div>
          </div>
          <div class="column">
            <div class="card4">
              <h2>The value of won deals per customer 2018:</h2>
               <ul><h3>{ Object.entries(customersWonDeal).map(([k, v]) => (<li>{k}: {v}</li>)) }</h3></ul></div>
          </div>
        </div>
      
        <footer>
          <div className="contact-us">
           <h4>Contact us</h4>
            <i class="material-icons">phone</i>
            <p>031-902311</p>
          </div>
          <div className="follow-us">   
              <li>
                <h4>Follow us</h4>
                <i class="material-icons">camera_alt</i>
                <i class="material-icons">public</i>
                <i class="material-icons">subscriptions</i>
                <p>@dreamteam</p>
              </li>
          </div>
          <div className="verified">      
              <h4>Verified dreamers</h4>
              <i className="material-icons">cloud_done</i>
              <p>dreamteam@info.com</p>    
          </div>    
        </footer>
         </div>
             
      
    )
    
  }
}

 