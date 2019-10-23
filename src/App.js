import React from "react";
import "./App.css";

const apiKey =
  "860393E332148661C34F8579297ACB000E15F770AC4BD945D5FD745867F590061CAE9599A99075210572";

export default class FetchRandomUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      person: null
    };
  }

  async componentDidMount() {
    const url = "http://localhost:3001/api/lime/limeobject";
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cors: 'no-cors',
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/hal+json",
        "x-api-key": apiKey
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    console.log(await response.json());
    this.setState({ person: {name: 'Perten'}, loading: false });
  }

    



  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
      </div>
    );
  }
}
