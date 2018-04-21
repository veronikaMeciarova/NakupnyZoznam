import React, { Component } from 'react';
import Tabulka from './Tabulka'
 
class Data extends Component {
  constructor(props) {
    super(props);
    this.idZoznam = this.props.item.id;
    this.state = {
        polozky: [],
    }
    this.getPolozky();
}

getPolozky() {
  var self = this;
  var data = {
      id: self.idZoznam, 
  }
  console.log(data);
  fetch('/items', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
  }).then(function(response) {
      if (response.status >= 400) {
          throw new Error("Bad response from server");
      }
      return response.json();
  }).then(function(data) {
      self.setState({
          polozky: data
      });
  }).catch(err => {
      console.log('caught it!',err);
  })
}

  render() {
    console.log(this.state.polozky)
    return (
      <div className="data">
        <p class="headerTabulka"  onClick={() => this.props.change(this.props.item)}> {this.props.item.nazov} ({this.props.item.nazov_skupina})</p>
        <Tabulka data={this.state.polozky}/>
      </div>
    );
  }
}
 
export default Data;