import React from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';
import "./Nav.css"

class Navigacia extends React.Component {

  render() {
    return (
      <Navbar brand="react-bootstrap" className="navBar">
        <Nav bsStyle="pills" activeKey="1" onSelect= {this.handleSelect}>
          <NavItem className="navItem" eventKey={1} href="#">Thing 1</NavItem>
          <NavItem className="navItem" eventKey={2} href="#">Thing 2</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Navigacia;