import React from "react";
import ReactDOM from "react-dom";
import Navigacia from "./Navigacia"
import TvorbaZoznamov from "./TvorbaZoznamov"
import {BrowserRouter,Route} from "react-router-dom"
import Prihlasovanie from "./Prihlasovanie"
import Registracia from "./Registracia"
import Nakup from "./Nakup"
import Skupiny from "./Skupiny"
import ZmenaHesla from "./ZmenaHesla";
  

// window.sessionStorage.setItem("meno", "veronika")
ReactDOM.render(   
    <div>
        <BrowserRouter>
            <div>
                <Route path='/zmenaHesla' render={(props) => <Navigacia {...props} id="0"/>} />
                <Route exact path='/nakup' render={(props) => <Navigacia {...props} id="1" />} />
                <Route path='/tvorbaZoznamov' render={(props) => <Navigacia {...props} id="2" />} />
                <Route path='/skupiny' render={(props) => <Navigacia {...props} id="3"/>} />
            </div>
        </BrowserRouter>,
    </div>,
    document.querySelector("#nav")
);  

ReactDOM.render(       
        <BrowserRouter>
            <div>
                <Route exact path='/' render={(props) => <Prihlasovanie {...props} setUserName={(name) => window.sessionStorage.setItem("meno", name)} />} />
                <Route exact path='/Registracia' render={(props) => <Registracia {...props} setUserName={(name) => window.sessionStorage.setItem("meno", name)}/>} />
                <Route path='/nakup' render={(props) => <Nakup {...props} />} />    
                <Route exact path='/tvorbaZoznamov' render={(props) => <TvorbaZoznamov {...props} />} />
                <Route path='/skupiny' render={(props) => <Skupiny {...props}/>} />
                <Route path='/zmenaHesla' render={(props) => <ZmenaHesla {...props}/>} />
            </div>
        </BrowserRouter>,
    document.querySelector("#obsah")
);