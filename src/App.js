import React from 'react';
import StarShower from "./components/StarShower";
import SideWaves from './components/SideWaves'
import Gravity from './components/Gravity'
import Home from "./components/Home";
import { HashRouter as Router , Route, Switch } from "react-router-dom";

import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/gravity" component={Gravity} />
          <Route exact path="/side_waves" component={SideWaves}/>
          <Route exact path="/star_shower" component={StarShower} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
