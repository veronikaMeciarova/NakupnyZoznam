import React, { Component } from 'react';
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import "./Tabulka.css"
 
const cellEditProp = {
    mode: 'click'
};

class Tabulka extends Component {

  render() {
    return (
      <div>
        {/* cellEdit={cellEditProp} */}
        <BootstrapTable data={this.props.data} selectRow={selectRowProp}>
          <TableHeaderColumn isKey dataField='id' width='20'>
            ID           
          </TableHeaderColumn>
          <TableHeaderColumn dataField='name' width='150' dataSort={true}>
            Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField='value' width='10' dataSort={true}>
            Value
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
 
const selectRowProp = {
    mode: 'checkbox',
    textColor: 'blue', 
    hideSelectColumn: true,  
    clickToSelect: true  
  };

export default Tabulka;