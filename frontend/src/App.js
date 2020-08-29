import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { ROUTES } from './routes'
// import './App.css';
import './scss/main.scss'
import Gallery from './pages/gallery'

import Header from './components/header'
import Footer from './components/footer'

function App() {
  document.body.className = 'poap-app'


  return (
    <div className="landing">
    <Router>
      <Header />
      <Switch>
        <Route path={ROUTES.home} component={Gallery}></Route>
      </Switch>
    <Footer />
    </Router>
    </div>
  );
}


export default App;
