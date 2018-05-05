import React from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';

class Navigacia extends React.Component {
  constructor(props) {
    super(props);   
    this.user = window.sessionStorage.getItem("meno");
    if (this.user === "") {
        window.location.href = '/';
    }
    this.active = this.props.id;
    this.navigacia = [
      {id:"1", link:"/nakup", nazov:"Nákup"},
      {id:"2", link:"/tvorbaZoznamov", nazov:"Tvorba zoznamov"},
      {id:"3", link:"/skupiny", nazov:"Skupiny"},]
    this.dropDownMenu = this.dropDownMenu.bind(this);

    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }

  createItem(item) {
    if (item.id === this.active) 
      return (<li className="active"><a href={item.link}>{item.nazov}</a></li>)
    else
      return  (<li><a href={item.link}>{item.nazov}</a></li>)
  }

  dropDownMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}


  render() {
    return (
      <div>
            <nav className="navbar">
              <div className="container">
                <div class="dropdown">
                    <p onClick={this.dropDownMenu} class="dropbtn">{this.user}▼</p>
                    <div id="myDropdown" class="dropdown-content">
                      <a href="/zmenaHesla">Zmena hesla</a>
                      <a onClick={() => window.sessionStorage.setItem("meno", "")} href="/">Odhlásenie</a>
                    </div>
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