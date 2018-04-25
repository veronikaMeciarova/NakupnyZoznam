import React, { Component } from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import PropTypes from 'prop-types';

class ZoznamInput extends Component {
    constructor(props) {
        super(props);
        this.currentUserName = this.props.currentUserName;
        this.state = {
            skupiny: [],
        }
        this.getSkupiny();
        this.addItem = this.addItem.bind(this);
    }

    getSkupiny() {
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
            self.setState({
                skupiny: data
            });
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    addItem(e) {
        var self = this;
        var zoznamNazov = this._inputElement.value;
        var skupinaNazov = document.getElementById("skupina").value;
        if (zoznamNazov !== "" && skupinaNazov !== "none") {
            var data = {zoznam: zoznamNazov,
                        skupina: skupinaNazov
                        };
            fetch("/newZoznam", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            }).then(function(data) {
                self.update();
            }).catch(function(err) {
                console.log(err)
            });
           this._inputElement.value = "";
        }
        
        e.preventDefault();
       
    }

    update() {
        this.props.onUpdate();
    }

    render() {
        return (
            <div className="inputBlock">
                <form onSubmit={this.addItem}>
                    <input  ref={(a) => this._inputElement = a}
                        placeholder="Názov zoznamu">
                    </input>
                    <select id='skupina'>
                        <option disabled selected value="none">Skupina</option>
                        {this.state.skupiny.map(sk =>
                            <option value={sk.nazov}>{sk.nazov}</option>
                        )}
                    </select>
                    <button className="btn" type="submit">Pridaj zoznam</button>
                </form>
            </div>
        );
    }
}
 
export default ZoznamInput;




  