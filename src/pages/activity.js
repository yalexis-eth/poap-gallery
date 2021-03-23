import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faQuestionCircle, faCoins, faFire, faGlobe, faLaptop, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet'
import {useDispatch, useSelector} from 'react-redux';
import {selectMostClaimed, selectMostRecent, selectUpcoming, selectHighestPoapPower, fetchIndexData} from '../store';
import {getMainnetTransfers, getxDaiTransfers, POAP_API_URL} from "../store/api";


export default function Activity() {
  const dispatch = useDispatch()

  // Meanwhile get all the events
  useEffect(() => {
    dispatch(fetchIndexData());
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  const [loading, setLoading] = useState(false)
  const [transfers, setTransfers] = useState([])
  const [daitransfers, setDaiTransfers] = useState([])
  const [mainnetTransfers, setMainnetTransfers] = useState([])

  const mostClaimed = useSelector(selectMostClaimed)
  const mostRecent = useSelector(selectMostRecent)
  const upcoming = useSelector(selectUpcoming)
  const highestPoapPower = useSelector(selectHighestPoapPower)


  useEffect(() => {
      setLoading(true)
      getMainnetTransfers(15)
        .then(
          (result) => {
            let tfrs = result.data.transfers
            setMainnetTransfers(tfrs)
            setLoading(false)
          },
          (error) => {
            setLoading(false)
            console.log('failed to query the graph',error)
          },
        );
  }, []);

  useEffect(() => {
      setLoading(true)
      getxDaiTransfers(15)
        .then(
          (result) => {
            let tfrs = result.data.transfers
            setDaiTransfers(tfrs)
            setLoading(false)
          },
          (error) => {
            setLoading(false)
            console.log('failed to query the graph',error)
          },
        );
  }, []);

  useEffect(() => {

    let tfrs = daitransfers.concat(mainnetTransfers)
    tfrs.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
    setTransfers(tfrs.slice(0, 15))
  }, [daitransfers, mainnetTransfers])



  return (
    <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Activity</title>
        <link rel="canonical" href="https://poap.gallery/activity"/>
        <meta property="og:url" content="https://poap.gallery/activity"></meta>
        <meta property="og:title" content="POAP Gallery - Activity"></meta>
      </Helmet>
      <div className="activityContainer container" style={{
        padding: '0 1rem',
      }}>

      <div className="gallery-grid activity-grid">

         <TokenCard event={mostRecent} />
         <TokenCard event={upcoming} />
         <TokenCard event={mostClaimed} />
         <TokenCard event={highestPoapPower} />

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
      <td> { new Date(transfer.timestamp * 1000).toLocaleDateString('en-UK') } </td>
      <td> {transfer.token.transferCount && transfer.token.transferCount > 0 ? transfer.token.transferCount : 'Claimed'} </td>
      <td style={{width:'50px', padding: '0 .5rem', height: '50px'}}>
        <a href={"https://app.poap.xyz/token/"+transfer.token.id}>
          <img style={{
            width: "100%",
            height: 'auto',
            borderRadius: '50%'
        }} src={`${POAP_API_URL}/token/${transfer.token.id}/image`} alt=""/>
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
                  <th>Id</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                  <th>Tx count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /> <ReactTooltip /> </th>
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
    <Link to={'/event/' + event.id} className="gallery-card">
      <div>
        <h4>{event.heading}</h4>
      </div>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '75px',
          height: '75px',
          overflow: 'hidden',
          borderRadius: '50%',
        }}
      >
        <img
          style={{
            width: 'auto',
            height: '100%%',
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
        <div style={{ marginTop: '5px' }}>
          {event.city ? <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faGlobe} /> : null}
          {event.city ? ' ' + event.city.length > 15 ? event.city.substr(0, 15) + '…' : event.city : (
            <div>
              {' '}
              <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faLaptop} /> virtual event{' '}
            </div>
          )}{' '}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCalendar} /> {event.start_date}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCoins} />{' '}
          {event.tokenCount ? event.tokenCount + ' supply ' : ' None Claimed'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faFire} />{' '}
          {event.power ? event.power +' power ' : '0 power'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faPaperPlane} />{' '}
          {event.transferCount ? event.transferCount + ' transfers' : '0 transfers '}
        </div>
      </div>
    </Link>
  );
}
