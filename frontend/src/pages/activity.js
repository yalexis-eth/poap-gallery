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
  const [transfers, setTransfers] = useState([])
  


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

  function getRecentTransfers() {
    
  }

  useEffect(() => {
    function fetchTransfers() {
      // fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
      fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          query: `
          {
            poapTransfers(first: 15, orderBy: time, orderDirection: desc) {
              id
              token {
                id
                transferCount
              }
              from {
                id
              }
              to {
                id
              }
              time
            }
          }
          `
        })
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log('result', result)
            setTransfers(result.data.poapTransfers)
          },
          (error) => {
            console.log('failed to query the graph',error)
          },
        );
    }
    fetchTransfers()
    const intervalId = setInterval(() => {
     fetchTransfers()
    }, 15000)
    return () => clearInterval(intervalId)
  }, []);

  return (
    <main id="site-main" role="main" className="app-content">
      <div className="activityContainer container" style={{
        padding: '0rem',
      }}>

        <div className="activitycards" style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          {items && items.length ? <TokenCard event={items[0]} /> : null} 
          {items && items.length ? <TokenCard event={items[1]} /> : null}
          {items && items.length ? <TokenCard event={items[2]} /> : null}
          {items && items.length ? <TokenCard event={items[3]} /> : null}

        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 1rem' }}>
          <CreateTable transfers={transfers} ></CreateTable>
        </div>
      </div>
    </main>
  )
}

function TokenRow({transfer}) {
  return (
    <tr>
      {/* <td><a href={"https://app.poap.xyz/token/" + transfer.id}>{transfer.id}</a></td> */}
      <td><a href={"https://app.poap.xyz/token/" + transfer.token.id}>{transfer.token.id}</a></td>
      <td><a href={"https://app.poap.xyz/scan/" + transfer.from.id}> {transfer.from.id.substring(0,16)} </a></td>
      <td><a href={"https://app.poap.xyz/scan/" + transfer.to.id}> {transfer.to.id.substring(0,16)} </a></td>
      {/* <td> {("0" + new Date(transfer.time * 1000).getHours()).substr(-2) + ':' +("0"+ new Date(transfer.time * 1000).getMinutes()).substr(-2) + ":"+("0"+new Date(transfer.time * 1000).getSeconds()).substr(-2)} </td> */}
      <td> { new Date(transfer.time * 1000).toLocaleDateString('en-UK') } </td>
      <td> {transfer.token.transferCount} </td>
      <td style={{ 
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: "75px",
          height: '75px',
        }}> <img src={"https://api.poap.xyz/token/"+transfer.token.id+"/image"} alt=""/> </td>
    </tr>
  )
}

function CreateTable({transfers}) {
  const tfers = []
  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i];
    tfers.push(<TokenRow key={t.id} transfer={t}></TokenRow>)
  }

  return (
    <table className="activityTable" style={{ width: '100%', border: 'none' }}>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Token Id</th>
                <th>From</th>
                <th>To</th>
                <th>Time</th>
                <th>Transfer count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /> <ReactTooltip /> </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tfers && tfers.length? tfers : (<tr><td style={{textAlign: 'center'}} colSpan="7">No Tokens Transferred</td></tr>)}
            </tbody>
    </table>
  )
}




function TokenCard({ event }) {
  return (
    <div className="activity-card" style={{display: "flex"}}>
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
        <div>{event.city || <div> <FontAwesomeIcon icon={faLaptop} data-tip="This is a virtual event" /> <ReactTooltip /> </div>}</div>
        <div>{event.start_date}</div>
        <div>Circulating supply X</div>
      </div>
    </div>
  )
}