import React, { Component } from 'react';
import Tabulka from './Tabulka'
import "./Tabulka.css"
 
var data = [
  {id: 1, name: 'Gob', value: '2'},
  {id: 2, name: 'Buster', value: '5'},
  {id: 3, name: 'George Michael', value: '4'}
];
 
 
class Data extends Component {
  render() {
    return (
      <div className="data">
        <p className="table-header">{this.props.nazov}</p>
        <Tabulka data={data}/>
      </div>
    );
  }
}
 
export default Data;