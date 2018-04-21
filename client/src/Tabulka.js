import React, { Component } from 'react';
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

const cellEditProp = {
    mode: 'click'
};

class Tabulka extends Component {
  constructor (props) {
    super(props)
    moment.locale();
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
    this.delete = this.delete.bind(this);
    this.createTasks = this.createTasks.bind(this);
  }
 
  handleChange(date) {
    this.setState({
      startDate: date
    });
  
  }

  delete(item){ //todo
    console.log("vymazavam", item.nazov)
  }

  createTasks(item) {
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


  render() {
    console.log(this.props.data);
    var data = this.props.data.map(this.createTasks);

    return (
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
              <td><input class="inpt" placeholder="Čo"></input></td>
              <td><input class="inpt" placeholder="Kde"></input></td>
              <td><input class="inpt" placeholder="Kto"></input></td>
              <td>
                  <DatePicker
                  dateFormat="DD/MM/YYYY"
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                  />
              </td>
              <td><input class="inpt" placeholder="Poznámka"></input></td>
            </tr>
          </tbody>
          </table>
          <button class="btn" type="submit">Pridaj do zoznamu</button>
      </div>
    );
  }
}

export default Tabulka;