import React, { Component } from "react";
import Notifications, {notify} from 'react-notify-toast';

class Reset extends Component {
    constructor(props) {
        super(props);
        if (window.sessionStorage.getItem("meno") !== "admin") {
            window.location.href = '/';
        }
        this.kto = "";
        this.state = {
            users: []
        }
        this.getAllUsers();
        this.resetPasswd = this.resetPasswd.bind(this);
        this.setKto = this.setKto.bind(this);
    }

    resetPasswd(event) {
        var self = this;
        var data = {
            meno: self.kto,
        }
        fetch('/resetPasswd', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            notify.show("Heslo bolo úspešne zresetované.", "error", 5000);
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    getAllUsers() {
        var self = this;
        fetch('/allUsers', {
            method: 'POST',
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.setState({
                users: data,
            });
            console.log(self.state)
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    setKto(event){
        this.kto = event.target.value;
    }

  render() {
    return (
        <div className="loginBox">
            <Notifications/>
            <select className="loginInput" id='users' onChange={this.setKto}>
                        <option disabled selected value="none">Používateľ</option>
                        {this.state.users.map(user =>
                            <option value={user.meno}>{user.meno}</option>
                        )}
                    </select>
            <button className="loginButton" type="submit" onClick={() => this.resetPasswd()}>Reset hesla</button>
        </div>
    );
  }
};
 
export default Reset;