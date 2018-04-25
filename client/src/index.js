import React from "react";
import ReactDOM from "react-dom";
import Navigacia from "./Navigacia"
import TvorbaZoznamov from "./TvorbaZoznamov"
import {BrowserRouter,Route} from "react-router-dom"
import Prihlasovanie from "./Prihlasovanie"
import Registracia from "./Registracia"
import Nakup from "./Nakup"
  

this.currentUserName = "veronika"

function setUsername(name) {
    window.currentUserName = name;
}

ReactDOM.render(       
    <div>
        <BrowserRouter>
            <div>
                <Route exact path='/nakup' render={(props) => <Navigacia {...props} user={this.currentUserName} id="1" />} />
                <Route path='/tvorbaZoznamov' render={(props) => <Navigacia {...props} user={this.currentUserName} id="2" />} />
                <Route path='/skupiny' render={(props) => <Navigacia {...props} user={this.currentUserName} id="3"/>} />
            </div>
        </BrowserRouter>,
    </div>,
    document.querySelector("#nav")
);  

ReactDOM.render(       
        <BrowserRouter>
            <div>
                <Route exact path='/' render={(props) => <Prihlasovanie {...props} setUserName={(name) => setUsername(name)} />} />
                <Route exact path='/Registracia' render={(props) => <Registracia {...props} setUserName={(name) => setUsername(name)}/>} />
                <Route path='/nakup' render={(props) => <Nakup {...props} currentUserName={this.currentUserName}/>} />    
                <Route exact path='/tvorbaZoznamov' render={(props) => <TvorbaZoznamov {...props} currentUserName={this.currentUserName}/>} />
                <Route path='/skupiny' render={(props) => <Prihlasovanie {...props} currentUserName={this.currentUserName}/>} />
            </div>
        </BrowserRouter>,
    document.querySelector("#obsah")
);