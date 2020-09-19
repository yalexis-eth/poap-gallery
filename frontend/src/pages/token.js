import React from 'react'
import PoapLogo from '../assets/images/POAP.svg'


export default function Activity() {
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{
      padding: '0rem',
    }}></div>

<div  style={{display: "flex", alignItems: "center", margin:"0rem 0",}}>
        test
  </div>

  <div className="gallery-grid" style={{
          //_poapapp.scss media 
      }}>

        <Cards/>
      </div>
    </main>
  )
}


function Cards() {
    var amount = 1;
    var cards = []
    for (let index = 0; index < amount ; index++) {
      cards.push(<TokenCard/>)
    }
    return cards
  }
  
  function TokenCard() {
    return (
        <div style={{
          // border: 'black solid 1px',
          borderRadius: '.5rem',
          width: '200px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 5px 16px rgba(100,100,100, 0.3)',
          padding: '1rem 0rem',
        }}>
          <div style={{
            // border: 'black solid 1px',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '75px',
            height: '75px',
          }}>
            <img style={{
              width: 'auto',
              height: '100%'
            }} src={PoapLogo} alt="POAP" />
          </div>
          <div>
            <h3>Poap Token</h3>
          </div>
          <div>
          </div>
        </div>
    )
  }