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
const PROXY_URL = "http://localhost:3001/api/lime/"
const API_URL = "https://api-test.lime-crm.com/api-test/api/v1/"

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
      }).map(deal => deal._id && deal.company)
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

  onLoadMore(event){
    const [url, params] = this.state.next.split('?')
    this.fetchLimeObjects(url, params)
  }

  componentDidMount() {
    this.fetchLimeObjects("http://localhost:3001/api/lime/limeobject/deal/", "_limit=10&_sort=-closeddate&_embed=company") 
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
      //Styling
      <div className="App">
        

        <h1>{ average }</h1>
        
        
        <button onClick = {this.onLoadMore.bind(this)}>load more</button>
        
         <p className="month">{ averagePerMonth }</p>
       
       <p className="customer">{ companies }</p>
       
         <ul className="customersWonDeals">{ Object.entries(customersWonDeal).map(([k, v]) => (<li>{k}: {v}</li>)) }</ul>
       
      </div>
    );
    
  }
}

 