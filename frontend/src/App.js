import React from 'react';
import {BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { ROUTES } from './routes'
// import './App.css';
import './scss/main.scss'
import Gallery from './pages/gallery'
import Activity from './pages/activity'
import Token from './pages/token'


import Header from './components/header'
import Footer from './components/footer'

function App() {
  document.body.className = 'poap-app'


  return (
    <BrowserRouter>
    <div className="landing">
      <Header />
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        <Route path={ROUTES.token}>
          <Token />
        </Route>
        <Route path={ROUTES.activity}>
          <Activity />
        </Route>
        <Route  path={ROUTES.home}>
          <Gallery />
        </Route>
      </Switch>
    <Footer />
    </div>
    </BrowserRouter>
  );
}

function About() {
  return <h2>About</h2>;
}


export default App;
