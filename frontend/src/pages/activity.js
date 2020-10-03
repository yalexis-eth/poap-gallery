import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faLaptop } from '@fortawesome/free-solid-svg-icons'
import { Token } from './token';
import PoapLogo from '../assets/images/POAP.svg';

export default function Activity() {

  const [items, setItems] = useState([])
  const [search, setSearch] = useState([])
  const [length, setLength] = useState(50)
  // false is descending true is ascending
  const [sortOrder, setSortOrder] = useState(false)
  const [sortVariable, setSortVariable] = useState('date')

  


  useEffect(() => {
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then(
        (result) => {

          setItems(result)
          // localStorage.setItem('poap_events', JSON.stringify(result))
        },
        (error) => {


        }
      )
  }, [])

  return (
    <main id="site-main" role="main" className="app-content">
      <div className="activityContainer" style={{
        padding: '0rem',
      }}>

        <div className="activitycards" style={{ display: "flex", justifyContent: "space-between"}}>
          {items && items.length ? <TokenCard event={items[0]} /> : null}
          {items && items.length ? <TokenCard event={items[1]} /> : null}
          {items && items.length ? <TokenCard event={items[2]} /> : null}
          {items && items.length ? <TokenCard event={items[3]} /> : null}

        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "0rem 0", }}>
          <table className="activityTable" style={{ width: "100%", border: "none" }}>


                       {/* <CreateTable tokens={tokens} ></CreateTable> */}
           
            <tr> 
              <th>#</th>
              <th>Name of POAP</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
              <th>Transfer count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /> <ReactTooltip /> </th>
              <th>POAP Image</th>
            </tr>
            <tr>
              <td>1</td>
              <td>ABC </td>
              <td>0xb4367dc4d2</td>
              <td> Inan</td>
              <td> 10.10.10</td>
              <td> 900</td>
              <td> img</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ABC POAP</td>
              <td>0xb4367dc4de</td>
              <td>0xb4367dc4d2</td>
              <td> 10.10.10</td>
              <td> 0</td>
              <td> img</td>
            </tr>
            <tr>
              <td>3</td>
              <td>ABC PP3</td>
              <td>0xb4367dc4de</td>
              <td>Stefan.eth</td>
              <td> 10.10.10</td>
              <td> 10,000</td>
              <td> img</td>
            </tr>
            <tr>
              <td>4</td>
              <td>ABC 1</td>
              <td>Max.eth</td>
              <td>Alexander.eth</td>
              <td> 10.10.10</td>
              <td> 10,000</td>
              <td> img</td>
            </tr>  
          </table>

        </div>
      </div>
    </main>
  )
}

function TokenRow({token}) {
  return (
    <tr>
      <td><a href={"https://app.poap.xyz/token/" + token.tokenId}>{token.id}</a></td>
      <td><a href={"https://app.poap.xyz/token/" + token.tokenId}>{token.name}</a></td>
      <td><a href={"https://app.poap.xyz/scan/" + token.owner}> {token.owner} </a></td>
      <td> 20.01.2020 </td>
      <td> 23</td>
      <td> 100 </td>
      <td> img </td>
    </tr>
  )
}

function CreateTable({tokens}) {
  const tkns = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    tkns.push(<TokenRow key={i} token={t}></TokenRow>)
    
  }

  return (
    <table className="activityTable" style={{ width: '100%', border: 'none' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name of POAP</th>
                <th>From</th>
                <th>To</th>
                <th>Time</th>
                <th>Transfer count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /> <ReactTooltip /> </th>
                <th>POAP Image</th>
              </tr>
            </thead>
            <tbody>
              {tkns && tkns.length? tkns : (<tr><td style={{textAlign: 'center'}} colSpan="5">No Tokens Claimed</td></tr>)}
            </tbody>
    </table>
  )
}




function TokenCard({ event }) {
  return (
    <div className="gallery-card" style={{display: "flex"}}>
      <div className="place"></div>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: "75px",
          height: '75px',
        }}
      >
        <img
          style={{
            width: 'auto',
            height: '100%',
            borderRadius: '50%',
          }}
          src={event.image_url}
          alt="POAP"
        />
      </div>
      <div
        style={{
          overflow: 'auto',
          width: '100%',
        }}
      >
        <h3
          title={event.name}
          className="h4"
          style={{
            fontSize: '1rem',
            textAlign: 'center',
            margin: '.8rem 0',
            overflowWrap: 'anywhere',
          }}
        >
          {event.name}
        </h3>
      </div>
      <div>
        <p>{event.city || <p> <FontAwesomeIcon icon={faLaptop} data-tip="This is a virtual event" /> <ReactTooltip /> </p>}</p>
        <p>{event.start_date}</p>
        <p>Circulating supply X</p>
      </div>
    </div>
  )
}