import React from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';

class Navigacia extends React.Component {
  constructor(props) {
    super(props);
    this.active = this.props.id;
    console.log(this.active);
    this.user = window.sessionStorage.getItem("meno");
    this.navigacia = [
      {id:"1", link:"/nakup", nazov:"Nákup"},
      {id:"2", link:"/tvorbaZoznamov", nazov:"Tvorba zoznamov"},
      {id:"3", link:"/skupiny", nazov:"Skupiny"},]
  }

  createItem(item) {
    if (item.id === this.active) 
      return (<li className="active"><a href={item.link}>{item.nazov}</a></li>)
    else
      return  (<li><a href={item.link}>{item.nazov}</a></li>)
  }

  render() {
    return (
      <div>
            <nav className="navbar">
              <div className="container">
                <a className="navbar-brand" href="#">{this.user}</a>
                <div className="navbar-right">
                  <div className="container minicart"></div>
                </div>
              </div>
            </nav>
            
            <div className="container-fluid breadcrumbBox text-center">
            <ol className="breadcrumb">
              {this.navigacia.map(n => this.createItem(n))}
            </ol>
          </div> 
    </div> 
    );
  }
}

export default Navigacia;