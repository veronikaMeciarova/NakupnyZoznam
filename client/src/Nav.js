import React from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';

class Navigacia extends React.Component {

  render() {
    return (
      <div>
            <nav className="navbar">
              <div className="container">
                <a className="navbar-brand" href="#">{this.props.user}</a>
                <div className="navbar-right">
                  <div className="container minicart"></div>
                </div>
              </div>
            </nav>
            
            <div className="container-fluid breadcrumbBox text-center">
            <ol className="breadcrumb">
              <li><a href="#">Review</a></li>
              <li className="active"><a href="#">Order</a></li>
              <li><a href="#">Payment</a></li>
            </ol>
          </div> 
    </div> 
    );
  }
}

export default Navigacia;