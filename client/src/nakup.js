import React, { Component } from "react";
import Zoznam from "./NakupnyZoznam"
import Polozky from "./Polozky"
import FlipMove from "react-flip-move";
import Tabulka from "./Tabulka.js"
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import Data from "./Data"

 
class Nakup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoznamy: ["ahoj"],
            open: []
        }
        this.getZoznamy();
        this.currentUserName = this.props.user;
        this.dajZoznam = this.getZoznamy.bind(this);
        this.change = this.change.bind(this);
        this.createTasks = this.createTasks.bind(this);
    }

    setClose(item) {
        item.open = false;
    }

    getZoznamy() {
        var self = this;
        console.log("zoznamy");
        var data = {
            name: "veronika",
        }
        console.log("meno", self.currentUserName)
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
        console.log("change", item);
        console.log(this.state);
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
            return (<li class="headerTabulka" onClick={() => this.change(item)} key={item.id}>{item.nazov}</li>)
        } else {
            return (
                <div key={item.id}>
                    <Data item={item} change={this.change}/>
                </div>
            )
        }
    }

  render() {
    var listItems = this.state.zoznamy.map(this.createTasks);

    return (
        <div className="container text-center">
        <div className="col-md-5 col-sm-12">
            <div className="bigcart"></div> 
            <Zoznam user={this.currentUserName} onUpdate={this.dajZoznam}/>	
		</div>
        
        <div className="col-md-7 col-sm-12 text-left">
            <ul className="zoznamPoloziek">
                <div className="Polozka">
                    <FlipMove duration={250} easing="ease-out">
                        {listItems}
                    </FlipMove>
                </div>
        </ul>
        </div>
    </div>
    );
  }
};
 
export default Nakup;
