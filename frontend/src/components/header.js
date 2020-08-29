import React from 'react'
import PoapLogo from '../assets/images/POAP.svg'
import { Link } from 'react-router-dom'

export default function () {
  return (
    <header id="site-header" role="banner">
    <div className="container">
      <div className="col-xs-6 col-sm-6 col-md-6">
        <Link to="/" className="logo">
          <img src={PoapLogo} alt="POAP" />
        </Link>
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6">
        <p className="page-title">Gallery</p>
      </div>
    </div>
  </header>
  )
}