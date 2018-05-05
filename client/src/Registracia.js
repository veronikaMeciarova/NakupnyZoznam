import React, { Component } from "react";
import Notifications, {notify} from 'react-notify-toast';

class Registracia extends Component {
    constructor(props) {
        super(props);
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
    

registrate() {
    if (!this.over(this._meno.value)) {
        notify.show("Prihlasovacie meno nesmie obsahovať špeciálne znaky.", "error", 5000);
    } else {
        if (!this.over(this._heslo.value)) {
            notify.show("Heslo nesmie byť prázdne alebo obsahovať špeciálne znaky.", "error", 5000);
        } else {
            if (this._meno.value.length < 1 && this._meno.value.length > 21) {
                notify.show("Prihlasovacie meno musí mať aspoň 1 znak a najviac 20", "error", 5000);
            } else {
                if (this._heslo.value.length < 5) {
                    notify.show("Heslo musí mať aspoň 5 znakov", "error", 5000);       
                } else {
                    if (this._heslo.value === this._heslo2.value) {
                        var data = {meno: this._meno.value,
                                    heslo: this._heslo.value
                                    };
                        var self = this;
                        fetch("/registr", {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data)
                        }).then(function(response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }
                            return response.json();
                        }).then(function(data) {
                            if (data.msg === "uzExistuje") {
                                notify.show("Zadané prihlasovacie meno už existuje", "error", 5000);
                            } else {
                                self.props.setUserName(self._meno.value);
                                window.location.href = '/tvorbaZoznamov';
                            }
                        }).catch(function(err) {
                            console.log(err)
                        });    
                    } else {
                        notify.show("Zadané heslá sa nezhodujú", "error", 5000);
                    }
                }
            }
        }  
    }
}

  render() {
    return (
        <div className="loginBox">
            <Notifications/>
            <input className="loginInput" ref={(a) => this._meno = a} placeholder="Prihlasovacie meno"></input>
            <input className="loginInput" ref={(a) => this._heslo = a} type="password" placeholder="Heslo"></input>   
            <input className="loginInput" ref={(a) => this._heslo2 = a} type="password" placeholder="Potvrď heslo"></input>              
            <button className="loginButton" type="submit" onClick={() => this.registrate()}>Registrovať</button>
        </div>
    );
  }
};
 
export default Registracia;