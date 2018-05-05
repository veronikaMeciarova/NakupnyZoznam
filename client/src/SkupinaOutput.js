import React, { Component } from 'react';
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Notifications, {notify} from 'react-notify-toast';
import 'react-datepicker/dist/react-datepicker.css';
 
class SkupinaOutput extends Component {
  constructor(props) {
    super(props);
    this.skupina = this.props.skupina;
    this.meno = this.props.meno;
    this.state = {
        clenovia: [],
    }
    this.getUsersOfGroup();
    this.create = this.create.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.over = this.over.bind(this);
}

over(text) {
    if (/^[a-zA-Z]/.test(text)) {
        return true;
        } else {
            return false;
        }
}


getUsersOfGroup() {
    var self = this;
    var data = {
        skupina: self.skupina.nazov, 
    }
    fetch('/usersGroup', {
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
            clenovia: data,
        });
    }).catch(err => {
        console.log('caught it!',err);
    })
  }

  create(clen) {
    if (this.skupina.vlastnik === window.sessionStorage.getItem("meno") && clen.meno_pouzivatel !== this.skupina.vlastnik){  
        return (
        <tr id={clen.meno_pouzivatel}>
            <th>{clen.meno_pouzivatel}</th>
            <th><button className="vlastnikInput" class="btn" type="submit" onClick={() => this.props.setOwner(clen.meno_pouzivatel, this.skupina)}>Vlastník</button>
</th>
        </tr>
        )
    } else {
        return (
        <tr id={clen.meno_pouzivatel}>
            <th>{clen.meno_pouzivatel}</th>
            <th></th>
        </tr>
        )
    }
  }

  changePassword(e) {
    if (!this.over(this._stareHeslo.value)) {
        notify.show("Nesprávne staré heslo.", "error", 5000);
    } else {
        if (!this.over(this._heslo.value)) {
            notify.show("Heslo nesmie obsahovať špeciálne znaky.", "error", 5000);
        } else {
            if (this._heslo.value.length < 5) {
                notify.show("Heslo musí mať aspoň 5 znakov", "error", 5000);       
            } else {
                if (this._heslo.value === this._heslo2.value) {
                    var data = {
                        stare: this._stareHeslo.value,
                        nove: this._heslo.value,
                        skupina: this.skupina.nazov,
                    };
                    var self = this;
                    fetch("/chPasswdGroup", {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    }).then(function(response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        return response.json();
                    }).then(function(data) {
                        if (data.msg === "zleHeslo") {
                            notify.show("Nesprávne staré heslo.", "error", 5000);
                        } else {
                            notify.show("Heslo bolo úspešne zmenené.", "error", 5000);
                        }
                    }).catch(function(err) {
                        console.log(err)
                    });    
                } else {
                    notify.show("Zadané heslá sa nezhodujú.", "error", 5000);
                }
            }
        }
    }
  }


  vlastnikButtons () {
    var self = this;
    if (self.skupina.vlastnik === window.sessionStorage.getItem("meno")){  
        return(
            <div>
            <input className="vlastnikInput" ref={(a) => self._stareHeslo = a} type="password" placeholder="Pôvodné heslo"></input>   
            <input className="vlastnikInput" ref={(a) => self._heslo = a} type="password" placeholder="Nové heslo"></input>
            <input className="vlastnikInput" ref={(a) => self._heslo2 = a} type="password" placeholder="Potvrď nové heslo"></input>
            <button  className="vlastnikInput" class="btn" type="submit" onClick={() => self.changePassword(this.props.skupina)}>Zmeň heslo skupine</button>
            <button className="vlastnikInput" class="btn" type="submit" onClick={() => self.props.deleteGroup(self.props.skupina)}>Odstráň skupinu</button>
            </div>
        )
    }
  }

  render() {
    var data = this.state.clenovia.map(this.create);
    var vlastnik = this.vlastnikButtons();
    return (
      <div className="data">
        <p className="headerTabulka" onClick={() => this.props.change(this.props.skupina)}> {this.skupina.nazov} ({this.skupina.vlastnik})</p>
        <div class="table-responsive">
        <Notifications/>
        <table class="table table-hover">
              <thead>
            <tr>
              <th>Členovia skupiny</th>
            </tr>
          </thead>
          <tbody>
            {data}
          </tbody>
          </table>
          <button class="btn" type="submit" onClick={() => this.props.opusti(this.props.skupina)}>Opusti skupinu</button>
          {vlastnik}
      </div>
      </div>
    );
  }
}
 
export default SkupinaOutput;