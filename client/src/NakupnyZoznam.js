import React, { Component } from "react";
import Polozky from "./Polozky"
import "./NakupnyZoznam.css"

class NakupnyZoznam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [] //nazvy tabuliek nakupnych zoznamov
        };
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.change = this.change.bind(this);
    }

    addItem(e) {
        if (this._inputElement.value !== "") {
          var newItem = {
            text: this._inputElement.value,
            key: Date.now(),
            open: false
          };
       
          this.setState((prevState) => {
            return { 
              items: prevState.items.concat(newItem) 
            };
          });
         
          this._inputElement.value = "";
        }
           
        e.preventDefault();
    }

    deleteItem(key) {
        var filteredItems = this.state.items.filter(function (item) {
          return (item.key !== key);
        });
       
        this.setState({
          items: filteredItems
        });
    }

    change(changeItem, opn) {
        changeItem.open = opn;
        this.setState({
          });
    }

    render() {
        return (
        <div className="zoznamMain">
            <div className="header">
                <form onSubmit={this.addItem}>
                    <input ref={(a) => this._inputElement = a}
                        placeholder="Nová položka">
                    </input>
                    <button type="submit">+</button>
                </form>
            </div>
            <Polozky entries={this.state.items}
                    delete={this.deleteItem}
                    change={this.change}/>
        </div>
        );
    }
}
 
export default NakupnyZoznam;




  