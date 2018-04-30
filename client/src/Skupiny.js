import React, { Component } from "react";
import FlipMove from "react-flip-move";
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import ZoznamOutput from "./ZoznamOutput"
import ZoznamInput from "./ZoznamInput"
import Notifications, {notify} from 'react-notify-toast';
import SkupinaOutput from "./SkupinaOutput"
 
class Skupiny extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skupiny: [],
            nazvy_skupin:[],
            open: [],
            mojeSkupiny: [],
            nazvy_mojeSkupiny: [],
        }
        this.getAllGroups();
        this.currentUserName = window.sessionStorage.getItem("meno");
        this.getMojeSkupiny();
        this.addGroup = this.addGroup.bind(this);
        this.joinGroup = this.joinGroup.bind(this);
        this.change = this.change.bind(this);
        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
        this.getAllGroups = this.getAllGroups.bind(this);
        this.optionsSkupiny = this.optionsSkupiny.bind(this);
    }

    getAllGroups() {
        var self = this;
        var data = {}
        fetch('/allGroups', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            var nazvy = [];
            data.map((sk) => nazvy = nazvy.concat(sk.nazov));
            self.setState({
                skupiny: data,
                nazvy_skupin: nazvy,
            });
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    addGroup(e){
        var self =this;
        if (self._novaSkupina.value.length < 1 && this._meno.value.length > 21) {
            notify.show("Názov skupiny musí mať aspoň 1 znak a najviac 20", "error", 5000);
        } else {
            if (self.state.nazvy_skupin.indexOf(self._novaSkupina.value) === -1) {
                if (this._heslo1.value.length < 5) {
                    notify.show("Heslo musí mať aspoň 5 znakov", "error", 5000);       
                } else { 
                    if (self._heslo1.value === self._heslo2.value) {
                        var self = this;
                        var data = {
                            skupina: self._novaSkupina.value,
                            meno: self.currentUserName,
                            heslo: self._heslo1.value
                        }
                        fetch('/addGroup', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data),
                        }).then(function(response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }
                            return response.json();
                        }).then(function(data) {
                            self.getAllGroups();
                            self.getMojeSkupiny();
                        }).catch(err => {
                            console.log('caught it!',err);
                        })
                    } else {
                        notify.show("Zadané heslá novej skupiny sa nezhodujú", "error", 5000);
                    }
                }
            } else {
                notify.show("Skupina s týmto názvom už existuje", "error", 5000);
            }
        }
        e.preventDefault();
    }

    joinGroup(e){
        var self = this;
        var data = {
            skupina: document.getElementById("skupina").value,
            meno: self.currentUserName,
            heslo: self._heslo3.value,
        }
        console.log("join", data)
        fetch('/joinGroup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.getAllGroups();
            self.getMojeSkupiny();
        }).catch(err => {
            console.log('caught it!',err);
        })
        e.preventDefault();
    }

    delete(skupina) {
        var self = this;
        var data = {
            skupina: skupina.nazov,
            meno: self.currentUserName,
        }
        console.log("unjoin", data)
        fetch('/unjoinGroup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.getAllGroups();
            self.getMojeSkupiny();
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    create(item) {
        var isOpen = this.state.open.indexOf(item.nazov);
        if (isOpen === -1) {
            return (<li key={item.nazov} className="headerTabulka" onClick={() => this.change(item)}>
                    {item.nazov}
            </li>)
        } else {
            return (
                <div key={item.nazov}>
                    <SkupinaOutput skupina={item} meno={this.currentUserName} change={this.change} delete={() => this.delete(item)}/>
                </div>
            )
        }
    }

    change(item) {
        var isOpen = this.state.open.indexOf(item.nazov);
        if (isOpen === -1) {
            var newState = this.state.open.concat(item.nazov);
            var prevSkupiny = this.state.skupiny;
            this.setState ({
                skupiny: prevSkupiny,
                open: newState
            })
        } else {
            var newState = this.state.open.splice(isOpen, 1);
            var prevSkupiny = this.state.skupiny;
            var filteredItems = this.state.open.filter(function (i) {
                      return (i !== item.nazov);
                    });
            this.setState ({
                zoznamy: prevSkupiny,
                open: filteredItems
            })
        }
    }

    getMojeSkupiny() {
        var self = this;
        var data = {
            name: self.currentUserName,
        }
        fetch('/groups', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            var nazvy = [];
            data.map((sk) => nazvy = nazvy.concat(sk.nazov));
            self.setState({
                mojeSkupiny: data,
                nazvy_mojeSkupiny: nazvy,
            });
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    optionsSkupiny(sk){
        var self = this;
        if (self.state.nazvy_mojeSkupiny.indexOf(sk.nazov) === -1) {
            return(
            <option value={sk.nazov}>{sk.nazov}</option>     
            )
        }                
    }

  render() {
    var listGroups = this.state.mojeSkupiny.map(this.create);

    return (
        <div className="container text-center">
        <div className="col-md-5 col-sm-12">
            <div className="bigcart"></div> 
            <div className="inputBlock">
            <Notifications/>
                <form onSubmit={this.addGroup}>
                    <input className="loginInput" ref={(a) => this._novaSkupina = a} placeholder="Názov skupiny"></input>
                    <input className="loginInput" ref={(a) => this._heslo1 = a} type="password" placeholder="Heslo"></input>   
                    <input className="loginInput" ref={(a) => this._heslo2 = a} type="password" placeholder="Potvrď heslo"></input>
                    <button className="btn" type="submit">Pridaj skupinu</button>
                </form>
                <form onSubmit={this.joinGroup}>
                    <select className="loginInput" id='skupina'>
                        <option disabled selected value="none">Skupina</option>
                        {this.state.skupiny.map(this.optionsSkupiny)}
                    </select>
                    <input className="loginInput" ref={(a) => this._heslo3 = a} type="password" placeholder="Heslo"></input>   
                    <button className="btn" type="submit">Pridaj ma do skupiny</button>
                </form>
            </div>
		</div>
        
        <div className="col-md-7 col-sm-12 text-left">
            <ul className="zoznamPoloziek">
                <div className="Polozka">
                    <FlipMove duration={250} easing="ease-out">
                        {listGroups}
                    </FlipMove>
                </div>
        </ul>
        </div>
    </div>
    );
  }
};
 
export default Skupiny;
