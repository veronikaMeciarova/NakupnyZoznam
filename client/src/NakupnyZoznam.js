import React, { Component } from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Polozky from "./Polozky"
import PropTypes from 'prop-types';

class NakupnyZoznam extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.state = {
            skupiny: [],
        }
        this.getSkupiny();
        this.addItem = this.addItem.bind(this);
    }

    getSkupiny() {
        var self = this;
        var data = {
            name: this.user,
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
                console.log("odpoved: ", data);  
                if(data == "success"){
                   this.setState({msg: "Thanks for registering"});  
                }
            }).catch(function(err) {
                console.log(err)
            });
           this._inputElement.value = "";
        }
        this.update();
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
                            <option value={sk.nazov_skupina}>{sk.nazov_skupina}</option>
                        )}
                    </select>
                    <button class="btn" type="submit">Pridaj zoznam</button>
                </form>
            </div>
        );
    }
}
 
export default NakupnyZoznam;




  