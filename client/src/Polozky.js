import React, { Component } from "react";
import Tabulka from "./Tabulka.js"
import FlipMove from "react-flip-move";
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import Data from "./Data"
 
class Polozky extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.state = {
            zoznamy: [],
            open: []
        }
        this.getZoznamy();
        this.createTasks = this.createTasks.bind(this);
    }

    setClose(item) {
        item.open = false;
    }

    getZoznamy() {
        var self = this;
        console.log("zoznamy");
        var data = {
            name: this.user,
        }
        fetch('/lists', {
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
                zoznamy: data
            });
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    change(item) {
        var isOpen = this.state.open.indexOf(item.id);
        if (isOpen === -1) {
            var newState = this.state.open.concat(item.id);
            var prevZoznamy = this.state.zoznamy;
            this.setState ({
                zoznamy: prevZoznamy,
                open: newState
            })
        } else {
            var newState = this.state.open.splice(isOpen, 1);
            var prevZoznamy = this.state.zoznamy;
            var filteredItems = this.state.open.filter(function (i) {
                      return (i !== item.id);
                    });
            this.setState ({
                zoznamy: prevZoznamy,
                open: filteredItems
            })
        }
    }

    createTasks(item) {
        var isOpen = this.state.open.indexOf(item.id);
        if (isOpen === -1) {
            return (<li onClick={() => this.change(item)} key={item.id}>{item.nazov}</li>)
        } else {
            return (
                <div onClick={() => this.change(item)} key={item.id}>
                    <Data nazov={item.nazov} />
                </div>
            )
        }
    }
 
  render() {
    var listItems = this.state.zoznamy.map(this.createTasks);
 
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
