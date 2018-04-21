import React from "react";
import ReactDOM from "react-dom";
import Zoznam from "./NakupnyZoznam"
import Navigacia from "./Nav"
import Data from "./Data"
import Databaza from "./Databaza"
import Polozky from "./Polozky"
import Nakup from "./nakup"
  
this.currentUserName = "veronika"


ReactDOM.render(       
    <div>
        <Navigacia user={this.currentUserName} />
    </div>,
    document.querySelector("#nav")
);  

ReactDOM.render(       
        <Nakup user={this.currentUserName}/>,
    document.querySelector("#obsah")
);