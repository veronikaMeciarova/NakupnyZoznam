import React, { Component } from "react";
import Tabulka from "./Tabulka.js"
import FlipMove from "react-flip-move";
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import "./Tabulka.css"
import Data from "./Data"
 
class Polozky extends Component {
    constructor(props) {
        super(props);
        this.createTasks = this.createTasks.bind(this);
    }
     
    delete(key) {
        this.props.delete(key);
    }

    change(item) {
        if (item.open === true) {
            this.props.change(item, false);
        } else {
            this.props.change(item, true);
        }
    }

    createTasks(item) {
        console.log(item);
        if (item.open === false) {
            return (<li onClick={() => this.change(item)} key={item.key}>{item.text}</li>)
        } else {
            return (
                <div onClick={() => this.change(item)} key={item.key}>
                    <Data nazov={item.text} />
                </div>
            )
        }
    }
 
  render() {
    var polozky = this.props.entries;
    var listItems = polozky.map(this.createTasks);
 
    return (
      <ul className="zoznamPoloziek">
             <div className="Polozka">
                <FlipMove duration={250} easing="ease-out">
                    {listItems}
                </FlipMove>
            </div>
      </ul>
    );
  }
};
 
export default Polozky;
