import React from "react";
import ReactDOM from "react-dom";
import Navigacia from "./Navigacia"
import TvorbaZoznamov from "./TvorbaZoznamov"
import {BrowserRouter,Route} from "react-router-dom"
  
this.currentUserName = "veronika"

ReactDOM.render(       
    <div>
        <BrowserRouter>
            <div>
                <Route exact path='/nakup' render={(props) => <Navigacia {...props} user={this.currentUserName} id="1" />} />
                <Route exact path='/' render={(props) => <Navigacia {...props} user={this.currentUserName} id="2" />} />
                <Route path='/skupiny' render={(props) => <Navigacia {...props} user={this.currentUserName} id="3"/>} />
            </div>
        </BrowserRouter>,
    </div>,
    document.querySelector("#nav")
);  

ReactDOM.render(       
        <BrowserRouter>
            <div>
                <Route path='/nakup' render={(props) => <TvorbaZoznamov {...props} currentUserName={this.currentUserName}/>} />    
                <Route exact path='/' render={(props) => <TvorbaZoznamov {...props} currentUserName={this.currentUserName}/>} />
                <Route path='/skupiny' render={(props) => <TvorbaZoznamov {...props} currentUserName={this.currentUserName}/>} />
            </div>
        </BrowserRouter>,
    document.querySelector("#obsah")
);