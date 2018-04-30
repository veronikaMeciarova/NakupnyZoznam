import React, { Component } from "react";
import FlipMove from "react-flip-move";
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import ZoznamOutput from "./ZoznamOutput"
import ZoznamInput from "./ZoznamInput"
 
class TvorbaZoznamov extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoznam: [],
            vsetky: true,
            nonCheckedSkupiny: [],
            nonCheckedZoznamy: [],
            nonCheckedObchody: [],
            obchody: [],
            zoznamy: [],
            skupiny: [], 
            obchod_nazov:[]
        }
        this.currentUserName = window.sessionStorage.getItem("meno");

        this.setSkupiny = this.setSkupiny.bind(this);
        this.setZoznamy = this.setZoznamy.bind(this);
        this.setObchody = this.setObchody.bind(this);

        this.getOstatne = this.getOstatne.bind(this);
        this.getObchody = this.getObchody.bind(this);
        this.getZoznamy = this.getZoznamy.bind(this);
        this.getSkupiny = this.getSkupiny.bind(this);
        this.getPolozky(this.getOstatne);

        this.createTasks = this.createTasks.bind(this);
        this.kupit = this.kupit.bind(this);
        this.setMy = this.setMy.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createCheckboxSkupina = this.createCheckboxSkupina.bind(this);
        this.createCheckboxZoznam = this.createCheckboxZoznam.bind(this);
        this.createCheckboxObchod = this.createCheckboxObchod.bind(this);
    }

    getOstatne(callback) {
        this.getObchody();
        this.getZoznamy();
        this.getSkupiny();
    }

    getPolozky(callback) {
        var self = this;
        var data = {
            meno: self.currentUserName,
        }
        fetch('/buyItems', {
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
                zoznam: data,
                vsetky: true,
            });
            callback();
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    getSkupiny() {
        var self = this;
        var pwd = [];
        for (var i=0; i<self.state.zoznam.length; i++){
            var p = self.state.zoznam[i].skupina;           
            if (pwd.indexOf(p) === -1) {
                var newArray = pwd.concat(p);
                pwd = newArray;
            }
        }
        self.setState({skupiny: pwd});
    }

    getZoznamy() {
        var self = this;
        var pwd = [];
        for (var i=0; i<self.state.zoznam.length; i++){
            var p = self.state.zoznam[i].zoznam;           
            if (pwd.indexOf(p) === -1) {
                var newArray = pwd.concat(p);
                pwd = newArray;
            }
        }
        self.setState({zoznamy: pwd});
    }

    getObchody() {
        var self = this;
        var pwd = [];
        var nazvy = {}
        for (var i=0; i<self.state.zoznam.length; i++){
            var p = self.state.zoznam[i].obchod;           
            if (pwd.indexOf(p) === -1) {
                var newArray = pwd.concat(p);
                pwd = newArray;
                nazvy[p] = self.state.zoznam[i].obchod_nazov;  
            }
        }
        self.setState({obchody: pwd, obchod_nazov: nazvy});
    }
    
    kupit(item) {
        var self = this;
        var data = {
            id: item.id,
            meno: self.currentUserName,
            kupena: item.kupena
        }
        fetch('/setItemAsBought', {
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
                zoznam: data,
            });
        }).catch(err => {
            console.log('caught it!',err);
        })
        console.log("kupil")
    }

    createTasks(item) {
        var vykresli = true;
        if (item.platna !== "platna") { vykresli = false;}
        if (this.state.vsetky === false && item.meno_pouzivatel !== this.currentUserName) { vykresli = false;}
        if (this.state.nonCheckedObchody.indexOf(item.obchod.toString()) > -1) { vykresli = false;}
        if (this.state.nonCheckedSkupiny.indexOf(item.skupina) > -1) { vykresli = false;}
        if (this.state.nonCheckedZoznamy.indexOf(item.zoznam) > -1) { vykresli = false;}
        if (vykresli) {
            if (item.kupena === "kupena") {

                return (
                    <tr onClick={() => this.kupit(item)} id={item.id}>
                        <th><font color="lightgrey">{item.nazov}</font></th>
                        <th><font color="lightgrey">{item.obchod_nazov}</font></th>
                        <th><font color="lightgrey">{item.meno_pouzivatel}</font></th>
                        <th><font color="lightgrey">{item.deadline}</font></th>
                        <th><font color="lightgrey">{item.poznamky}</font></th>
                        <th><font color="lightgrey">{item.skupina}</font></th>
                        <th><font color="lightgrey">{item.zoznam}</font></th>
                    </tr>
                )
            } else {
                return (
                <tr onClick={() => this.kupit(item)} id={item.id}>
                    <th>{item.nazov}</th>
                    <th>{item.obchod_nazov}</th>
                    <th>{item.meno_pouzivatel}</th>
                    <th>{item.deadline}</th>
                    <th>{item.poznamky}</th>
                    <th>{item.skupina}</th>
                    <th>{item.zoznam}</th>
                </tr>
                )
            }
        }
      }

      createCheckboxSkupina(item) {
        var self = this;
        return (
            <div>
            <input type="checkbox" value={item} checked={self.state.nonCheckedSkupiny.indexOf(item) === -1} onChange={self.setSkupiny}/>  {item}<br/>
            </div>
        )
      }

      setSkupiny(event) {
        var self = this;
        var index = self.state.nonCheckedSkupiny.indexOf(event.target.value);
        if (index === -1) {
            var newArray = this.state.nonCheckedSkupiny.concat(event.target.value);
        } else {
            var newArray = this.state.nonCheckedSkupiny.filter(i => i !== event.target.value)
        }
        self.setState({
            nonCheckedSkupiny: newArray,
        });
      }

      createCheckboxZoznam(item) {
        var self = this;
        return (
            <div>
            <input type="checkbox" value={item} checked={self.state.nonCheckedZoznamy.indexOf(item) === -1} onChange={self.setZoznamy}/>  {item}<br/>
            </div>
        )
      }

      setZoznamy(event) {
        var self = this;
        var index = self.state.nonCheckedZoznamy.indexOf(event.target.value);
        console.log(self.state.nonCheckedZoznamy)
        console.log(index);
        if (index === -1) {
            var newArray = this.state.nonCheckedZoznamy.concat(event.target.value);
        } else {
            var newArray = this.state.nonCheckedZoznamy.filter(i => i !== event.target.value)
        }
        self.setState({
            nonCheckedZoznamy: newArray,
        });
      }

      createCheckboxObchod(item) {
        var self = this;
        return (
            <div>
            <input type="checkbox" value={item} checked={self.state.nonCheckedObchody.indexOf(item) === -1} onChange={self.setObchody}/>  {self.state.obchod_nazov[item]}<br/>
            </div>
        )
      }

      setObchody(event) {
        var self = this;
        var index = self.state.nonCheckedObchody.indexOf(event.target.value);
        if (index === -1) {
            var newArray = this.state.nonCheckedObchody.concat(event.target.value);
        } else {
            var newArray = this.state.nonCheckedObchody.filter(i => i !== event.target.value)
        }
        self.setState({
            nonCheckedObchody: newArray,
        });
      }

    
    setMy(event){
        if (event.target.value === "moje") {
            this.setState({
                zoznam: this.state.zoznam,
                vsetky: false,
            });
        } else {
            this.setState({
                zoznam: this.state.zoznam,
                vsetky: true,
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
      }
      

  render() {
    var data = this.state.zoznam.map(this.createTasks);
    var skupinyCB = this.state.skupiny.map(this.createCheckboxSkupina);
    var zoznamyCB = this.state.zoznamy.map(this.createCheckboxZoznam);
    var obchodyCB = this.state.obchody.map(this.createCheckboxObchod);

    return (
    <div className="container text-center">
        <div className="col-md-5 col-sm-12">
            <div className="bigcart"></div> 
            <form onSubmit={this.handleSubmit}>
                <label><input className="nakupSel" type="radio" value="moje" checked={this.state.vsetky === false} onChange={this.setMy}/>  len moje položky  </label><br/>
                <label><input className="nakupSel" type="radio" value="vsetky" checked={this.state.vsetky === true} onChange={this.setMy}/>  všetky položky</label>
            </form>
            <h4>Skupiny:</h4>
            <form onSubmit={this.handleSubmit}>
                {skupinyCB}
            </form>
            <h4>Zoznamy:</h4>
            <form onSubmit={this.handleSubmit}>
                {zoznamyCB}
            </form>
            <h4>Obchody:</h4>
            <form onSubmit={this.handleSubmit}>
                {obchodyCB}
            </form>
        </div>
        
        <div className="col-md-7 col-sm-12 text-left">
            <div className="data">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Názov</th>
                                <th>Obchod</th>
                                <th>Kto</th>
                                <th>Deadline</th>
                                <th>Poznámky</th>
                                <th>Skupina</th>
                                <th>Zoznam</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    );
  }
};
 
export default TvorbaZoznamov;
