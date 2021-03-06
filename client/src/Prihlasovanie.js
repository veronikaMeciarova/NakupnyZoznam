import React, { Component } from "react";
import Notifications, {notify} from 'react-notify-toast';

class Prihlasovanie extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.registrate = this.registrate.bind(this);
        this.over = this.over.bind(this);
    }

    over(text) {
        if (/^[a-zA-Z]/.test(text)) {
            return true;
            } else {
                return false;
            }
    }
    
  login() {
    var self = this;
    if (!this.over(this._meno.value)) {
        notify.show("Prihlasovacie meno nesmie byť prázdne alebo obsahovať špeciálne znaky.", "error", 5000);
    } else {
        if (!this.over(this._heslo.value)) {
            notify.show("Heslo nesmie byť prázdne alebo obsahovať špeciálne znaky.", "error", 5000);
        } else {
            var data = {meno: this._meno.value,
                        heslo: this._heslo.value
                        };
            fetch("/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(function(response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            }).then(function(data) {
                if (data.msg === "ok") {
                    self.props.setUserName(self._meno.value);
                    window.location.href = '/tvorbaZoznamov';
                }
                if (data.msg === "zleHeslo") {
                    notify.show("Nesprávne heslo", "error", 5000);
                } 
                if (data.msg === "neexistuje") {
                    notify.show("Zadané prihlasovacie meno neexistuje", "error", 5000);
                }
            }).catch(function(err) {
                console.log(err)
            }); 
        }
    }   
  }

  registrate() {
      window.location.href = '/Registracia';
  }

  render() {
    return (
        <div className="loginBox">
            <Notifications />
            <input className="loginInput" ref={(a) => this._meno = a} placeholder="Prihlasovacie meno"></input>
            <input className="loginInput" ref={(a) => this._heslo = a} type="password" placeholder="Heslo"></input>
            <button className="loginButton" type="submit" onClick={() => this.login()}>Prihlásiť</button>               
            <button className="loginButton" type="submit" onClick={() => this.registrate()}>Registrovať</button>
        </div>
    );
  }
};
 
export default Prihlasovanie;
