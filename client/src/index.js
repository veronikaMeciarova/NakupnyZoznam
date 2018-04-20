import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Zoznam from "./NakupnyZoznam"
import Navigacia from "./Nav"
import Data from "./Data"
import Databaza from "./Databaza"
  
ReactDOM.render(       
    <div>
        <Navigacia/>
    </div>,
    document.querySelector("#nav")
);  

ReactDOM.render(       
    <div>
        <Zoznam/>
        <Databaza />
    </div>,
    document.querySelector("#container")
);