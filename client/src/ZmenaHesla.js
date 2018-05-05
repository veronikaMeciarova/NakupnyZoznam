import React, { Component } from "react";
import Notifications, {notify} from 'react-notify-toast';

class ZmenaHesla extends Component {
    constructor(props) {
        super(props);
        this.currentUserName = window.sessionStorage.getItem("meno");
        this.changePasswd = this.changePasswd.bind(this);
        this.over = this.over.bind(this);
    }

    over(text) {
        if (/^[a-zA-Z]/.test(text)) {
            return true;
            } else {
                return false;
            }
    }

changePasswd(e) {
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
                        meno: this.currentUserName,
                    };
                    var self = this;
                    fetch("/chPasswd", {
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
                            notify.show("Nesprávne staré heslo", "error", 5000);
                        } else {
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

  render() {
    return (
        <div className="chPasswdBox">
            <Notifications/>
            <input className="loginInput" ref={(a) => this._stareHeslo = a} type="password" placeholder="Pôvodné heslo"></input>
            <input className="loginInput" ref={(a) => this._heslo = a} type="password" placeholder="Nové heslo"></input>   
            <input className="loginInput" ref={(a) => this._heslo2 = a} type="password" placeholder="Potvrď nové heslo"></input>              
            <button className="loginButton" type="submit" onClick={() => this.changePasswd()}>Zmeniť heslo</button>
        </div>
    );
  }
};
 
export default ZmenaHesla;