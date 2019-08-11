import React from 'react'
import { HashRouter as Router, Link } from "react-router-dom";

import './index.css'

class Home extends React.Component{
  render() {
    return (
      <div className="home_container">
        <Router>
          <Link className="block_link" to="/side_waves">side waves</Link>
          <Link className="block_link" to="/gravity">gravity</Link>
          <Link className="block_link" to="/star_shower">star shower</Link>
        </Router>
      </div>
    )
  }
}

export default Home