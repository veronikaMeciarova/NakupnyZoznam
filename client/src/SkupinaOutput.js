import React, { Component } from 'react';
import {BootstrapTable, 
    TableHeaderColumn} from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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
        console.log(data);
    }).catch(err => {
        console.log('caught it!',err);
    })
  }

  create(clen) {
    return (
    <tr id={clen.meno_pouzivatel}>
        <th>{clen.meno_pouzivatel}</th>
    </tr>
    )
  }

  render() {
    var data = this.state.clenovia.map(this.create);
    return (
      <div className="data" onClick={() => this.props.change(this.props.skupina)}>
        <p className="headerTabulka"> {this.skupina.nazov}</p>
        <div class="table-responsive">
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
          <button class="btn" type="submit" onClick={() => this.props.delete(this.props.skupina)}>Opusti skupinu</button>
      </div>
      </div>
    );
  }
}
 
export default SkupinaOutput;