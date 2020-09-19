import React from 'react';
import {BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { ROUTES } from './routes'
// import './App.css';
import './scss/main.scss'
import Gallery from './pages/gallery'
import Activity from './pages/activity'
import Tokens from './pages/token'


import Header from './components/header'
import Footer from './components/footer'

function App() {
  document.body.className = 'poap-app'


  return (
    <BrowserRouter>
    <div className="landing">
      <Header />
      <Switch>
        <Route path={ROUTES.token}>
          <Tokens />
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


export default App;
