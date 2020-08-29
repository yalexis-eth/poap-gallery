import React from 'react'
import PoapLogo from '../assets/images/POAP.svg'


export default function gallery() {
  return (
    <main id="site-main" role="main" className="app-content">
     <div className="container" style={{
      padding: '1rem',
    }}>
      <div style={{
        display: 'grid'
      }}>
        <Cards/>
      </div>
    </div>
  </main>
  )
}


function Cards() {
  var amount = 30
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
          some description or tags
        </div>
      </div>
  )
}
