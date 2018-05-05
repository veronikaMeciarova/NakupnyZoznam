import React, { Component } from 'react';
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Notifications, {notify} from 'react-notify-toast';


import 'react-datepicker/dist/react-datepicker.css';
 
class ZoznamOutput extends Component {
  constructor(props) {
    super(props);
    this.zoznam = this.props.item;
    this.state = {
        polozky: [],
        startDate: moment(),
        users: [],
        shops: []
    }
    this.getUsersOfGroup();
    this.getShopsOfGroup();
    this.getPolozky();
    moment.locale();
    this.handleChange = this.handleChange.bind(this);
    this.delete = this.delete.bind(this);
    this.createTasks = this.createTasks.bind(this);
    this.addItem = this.addItem.bind(this);
    this.getShopsOfGroup = this.getShopsOfGroup.bind(this);
    this.getIdShop = this.getIdShop.bind(this);
    this.setKto = this.setKto.bind(this);
    this.over = this.over.bind(this);
}

over(text) {
    if (/^[a-zA-Z]/.test(text)) {
        return true;
        } else {
            return false;
        }
}

getIdShop(callback) {
    var self = this;
    if (!this.over(self._kde.value)) {
        notify.show("Názov obchodu nesmie byť prázdny alebo obsahovať špeciálny znak.", "error", 5000);
    } else {
        var obch = this.state.shops.filter(s => s.nazov === self._kde.value);
        var obchodID;
        if (obch.length === 0) {
            fetch('/addShop', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({obchod: self._kde.value, skupina: self.zoznam.nazov_skupina}),
            }).then(function(response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            }).then(function(data) {
                self.getShopsOfGroup();
                callback(data[0].id);
            }).catch(err => {
                console.log('caught it!',err);
            })
        } else {
            console.log("stary obchod", obch[0].id);
            callback (obch[0].id);
        }
    }
}

addItem(obchodId) {
    var self = this;
    if (this.over(self._co.value) && this.over(self._kto.value) && this.over(self._pozn.value)) {
        var data = {
            id_zoznam: self.zoznam.id, 
            nazov: self._co.value,
            obchod: obchodId,
            meno: self._kto.value,
            deadline: moment(self.state.startDate).format('YYYY/MM/DD'),
            poznamka: self._pozn.value,
            nazov_skupina: self.zoznam.nazov_skupina
        }

        fetch('/addItem', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.getPolozky();
        }).catch(err => {
            console.log('caught it!',err);
        })
    } else {
        notify.show("Vstup nesmie byť prázdny alebo obsahovať špeciálny znak.", "error", 5000);
    }
}

getPolozky() {
  var self = this;
  var data = {
      id: self.zoznam.id, 
  }
  fetch('/items', {
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
        polozky: data,
        users: self.state.users,
        shops: self.state.shops,
        startDate: self.state.startDate,
      });
      console.log("tu", self.state.polozky);
  }).catch(err => {
      console.log('caught it!',err);
  })
}

getUsersOfGroup() {
    var self = this;
    var data = {
        skupina: self.zoznam.nazov_skupina, 
    }
    console.log(data);
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
            polozky: self.state.polozky,
            users: data,
            shops: self.state.shops,
            startDate: self.state.startDate,
        });
    }).catch(err => {
        console.log('caught it!',err);
    })
  }

  getShopsOfGroup() {
    var self = this;
    var data = {
        skupina: self.zoznam.nazov_skupina, 
    }
    console.log(data);
    fetch('/shopsGroup', {
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
            polozky: self.state.polozky,
            users: self.state.users,
            shops: data,
            startDate: self.state.startDate,
        });
    }).catch(err => {
        console.log('caught it!',err);
    })
  }

handleChange(date) {
    this.setState({
        polozky: this.state.polozky,
        startDate: date,
        users: this.state.users,
        shops: this.state.shops,
    });
  }

  delete(item){
    console.log("vymazavam", item.nazov)
    var self = this;
    var data = {
        id: item.id, 
    }
    fetch('/itemDelete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }).then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then(function(data) {
        self.getPolozky();
    }).catch(err => {
        console.log('caught it!',err);
    })  
  }

  createTasks(item) {
    console.log("platnost", item.platna);
    if (item.platna === "platna") {
        return (
        <tr onClick={() => this.delete(item)} id={item.id}>
            <th>{item.nazov}</th>
            <th>{item.obchod}</th>
            <th>{item.meno_pouzivatel}</th>
            <th>{item.deadline}</th>
            <th>{item.poznamky}</th>
        </tr>
        )
    }
  }

  setKto(event) {
      var self = this;
      self._kto = event.target;
  }

  render() {
    var data = this.state.polozky.map(this.createTasks);
    return (
      <div className="data">
        <Notifications/>
        <p className="headerTabulka"  onClick={() => this.props.change(this.props.item)}> {this.props.item.nazov} ({this.props.item.nazov_skupina})</p>
        <div class="table-responsive">
        <table class="table table-hover">
              <thead>
            <tr>
              <th>Názov</th>
              <th>Obchod</th>
              <th>Kto</th>
              <th>Deadline</th>
              <th>Poznámky</th>
            </tr>
          </thead>
          <tbody>
            {data}
            <tr >
              <td><input class="inpt" placeholder="Čo" ref={(a) => this._co = a}></input></td>
              <td><input class="inpt" placeholder="Kde" type="text" list="obchody" ref={(a) => this._kde = a} />
                    <datalist id="obchody">
                    {this.state.shops.map(shop =>
                            <option value={shop.nazov}/>
                        )}
                    </datalist>
              </td>
              <td>  <select id='usersGroup' onChange={this.setKto}>
                        <option disabled selected value="none">Kto</option>
                        {this.state.users.map(user =>
                            <option value={user.meno_pouzivatel}>{user.meno_pouzivatel}</option>
                        )}
                    </select>
                </td>
              <td>
                  <DatePicker
                  dateFormat="DD.MM.YYYY"
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                  />
              </td>
              <td><input class="inpt" placeholder="Poznámka" ref={(a) => this._pozn = a}></input></td>
            </tr>
          </tbody>
          </table>
          <button class="btn" type="submit" onClick={() => this.getIdShop(this.addItem)}>Pridaj položku do zoznamu</button>
          <button class="btn" type="submit" onClick={() => this.props.delete(this.props.item)}>Odstráň zoznam</button>
          
      </div>
      </div>
    );
  }
}
 
export default ZoznamOutput;