import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faLaptop } from '@fortawesome/free-solid-svg-icons'

export default function Activity() {

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState([])
  const [length, setLength] = useState(50)
  // false is descending true is ascending
  const [sortOrder, setSortOrder] = useState(false)
  const [sortVariable, setSortVariable] = useState('date')
  const [transfers, setTransfers] = useState([])
  

  useEffect(() => {
    function fetchTransfers() {
      setLoading(true)
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
            setLoading(false)
            setTransfers(result.data.poapTransfers)
          },
          (error) => {
            setLoading(false)
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

        <div className="activitycards" style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", minHeight: '300px'}}>
         <TokenCard event={{ heading: 'Most recent Event'}} /> 
         <TokenCard event={{ heading: 'Upcoming Event'}} />
         <TokenCard event={{ heading: 'Most Claimed Token'}} />
         <TokenCard event={{ heading: 'Highest Poap Power'}} />

        </div>

        <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', minWidth: '100%' }}>
          <CreateTable loading={loading} transfers={transfers} ></CreateTable>
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
      <td><a href={"https://app.poap.xyz/scan/" + transfer.from.id}> {transfer.from.id.substring(0,16)+ '…'} </a></td>
      <td><a href={"https://app.poap.xyz/scan/" + transfer.to.id}> {transfer.to.id.substring(0,16)+ '…'} </a></td>
      {/* <td> {("0" + new Date(transfer.time * 1000).getHours()).substr(-2) + ':' +("0"+ new Date(transfer.time * 1000).getMinutes()).substr(-2) + ":"+("0"+new Date(transfer.time * 1000).getSeconds()).substr(-2)} </td> */}
      <td> { new Date(transfer.time * 1000).toLocaleDateString('en-UK') } </td>
      <td> {transfer.token.transferCount && transfer.token.transferCount > 0 ? transfer.token.transferCount : 'Claimed'} </td>
      <td style={{width:'50px', padding: '0 .5rem', height: '50px'}}>
        <a href={"https://app.poap.xyz/token/"+transfer.token.id}>
          <img style={{
            width: "100%",
            height: 'auto',
            borderRadius: '50%'
        }} src={"https://api.poap.xyz/token/"+transfer.token.id+"/image"} alt=""/>
        </a>
      </td>
    </tr>
  )
}

function CreateTable({transfers, loading}) {
  const tfers = []
  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i];
    tfers.push(<TokenRow key={t.id} transfer={t}></TokenRow>)
  }
  return (
      <table className="table" style={{ width: '100%', fontSize: '.93rem', whiteSpace: 'nowrap', border: 'none' }}>
              <thead>
                <tr>
                  {/* <th>#</th> */}
                  <th>Id</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                  <th>Transfer count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /> </th>
                  <th>Img</th>
                </tr>
              </thead>
              <tbody>
                {loading ?<tr style={{height: '600px', width: 'inherit'}}><td className="loading" colSpan="6"></td></tr>  : tfers && tfers.length? tfers : (<tr><td style={{textAlign: 'center'}} colSpan="7">No Tokens Transferred</td></tr>)}
              </tbody>
      </table>
  )
}




function TokenCard({ event }) {
  return (
    <div className="activity-card" style={{display: "flex"}}>
      <div className="place"></div>
      <div>
        <h4>{event.heading}</h4>
      </div>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: "75px",
          height: '75px',
          borderRadius: '50%',
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
        <div>{event.city || <div> <FontAwesomeIcon icon={faLaptop} data-tip="This is a virtual event" /> </div>}</div>
        <div>{event.start_date}</div>
        <div>Circulating supply X</div>
      </div>
    </div>
  )
}