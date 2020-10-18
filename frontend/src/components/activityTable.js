import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'


dayjs.extend(relativeTime)


export default function ActivityTable() {

  const [loading, setLoading] = useState(false)
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
            poapTransfers(first: 2, orderBy: time, orderDirection: desc) {
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
        <div className="feed" style={{display: "flex", flexDirection : "column" , justifyContent: "center", fontSize: '.89rem'}}>
          <div style={{margin: '0 auto'}}>
            <Transfers loading={loading} transfers={transfers} ></Transfers>
          </div>
          <div style={{display: "flex" , justifyContent: "center", margin: '.5rem 0'}}> <Link to="/activity">Recent Activity</Link> </div>
        </div>
  )
}

function Claim({transfer}) {
  return (
    <div style={{margin: '.2rem 0'}}>
      <span>Token </span>
      <a style={{width: '1.3rem'}} href={"https://app.poap.xyz/token/"+transfer.token.id}>
      <img style={{
       width: "1.3rem",
       height: '1.3rem',
       borderRadius: '50%'
   }} src={"https://api.poap.xyz/token/"+transfer.token.id+"/image"} alt=""/>
   </a>
      <span> was claimed by <a href={"https://app.poap.xyz/scan/" + transfer.to.id}> {transfer.to.id.substring(0,16)+ '…'} </a> {dayjs(transfer.time * 1000).fromNow()} </span> 
    </div>
  )
}
function Transfer({transfer}) {
  return (
    <div style={{margin: '.2rem 0'}}>
      <span>Token </span>
    <a style={{width: '1.3rem'}} href={"https://app.poap.xyz/token/"+transfer.token.id}>
      <img style={{
       width: "1.3rem",
       height: '1.3rem',
       borderRadius: '50%'
   }} src={"https://api.poap.xyz/token/"+transfer.token.id+"/image"} alt=""/>
   </a>
      <span> was transferred from <a href={"https://app.poap.xyz/scan/" + transfer.from.id}> {transfer.from.id.substring(0,16)+ '…'} </a> to <a href={"https://app.poap.xyz/scan/" + transfer.to.id}> {transfer.to.id.substring(0,16)+ '…'} </a> {dayjs(transfer.time * 1000).fromNow()} </span> 
    </div>
  )
}

function Transfers({transfers, loading}) {
  const tfers = []
  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i];
    if(t.from.id === '0x0000000000000000000000000000000000000000') {
      tfers.push(<Claim key={t.id} transfer={t}></Claim>)
    } else {
      tfers.push(<Transfer key={t.id} transfer={t}></Transfer>)
    }
  }
  return tfers
}


//  {/* <td><a href={"https://app.poap.xyz/token/" + transfer.id}>{transfer.id}</a></td> */}
//  <td><a href={"https://app.poap.xyz/token/" + transfer.token.id}>{transfer.token.id}</a></td>
//  <td><a href={"https://app.poap.xyz/scan/" + transfer.from.id}> {transfer.from.id.substring(0,16)+ '…'} </a></td>
//  <td><a href={"https://app.poap.xyz/scan/" + transfer.to.id}> {transfer.to.id.substring(0,16)+ '…'} </a></td>
//  {/* <td> {("0" + new Date(transfer.time * 1000).getHours()).substr(-2) + ':' +("0"+ new Date(transfer.time * 1000).getMinutes()).substr(-2) + ":"+("0"+new Date(transfer.time * 1000).getSeconds()).substr(-2)} </td> */}
//  <td> { new Date(transfer.time * 1000).toLocaleDateString('en-UK') } </td>
//  <td> {transfer.token.transferCount && transfer.token.transferCount > 0 ? transfer.token.transferCount : 'Claimed'} </td>
//  <td style={{width:'50px', padding: '0 .5rem', height: '50px'}}>
//    <a href={"https://app.poap.xyz/token/"+transfer.token.id}>
//      <img style={{
//        width: "100%",
//        height: 'auto',
//        borderRadius: '50%'
//    }} src={"https://api.poap.xyz/token/"+transfer.token.id+"/image"} alt=""/>
//    </a>
//  </td>