import React, {useEffect, useState} from 'react'
import ReactTooltip from 'react-tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowUp, faDotCircle, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {Helmet} from 'react-helmet'
import {useDispatch, useSelector} from 'react-redux';
import {fetchIndexData, selectMostClaimed, selectMostRecent, selectUpcoming} from '../store';
import {getMainnetTransfers, getxDaiTransfers, POAP_API_URL} from "../store/api";
import {EventCard} from "../components/eventCard";
import { Pill } from '../components/pill';
import Migration from '../assets/images/migrate.svg'
import Claim from '../assets/images/claim.svg'
import Transfer from '../assets/images/transfer.svg'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Foliage } from '../components/foliage';
import { shrinkAddress } from '../utilities/utilities';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Link } from 'react-router-dom'

dayjs.extend(relativeTime)

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
  const width = useWindowWidth();

  const mostClaimed = useSelector(selectMostClaimed)
  const mostRecent = useSelector(selectMostRecent)
  const upcoming = useSelector(selectUpcoming)
  const transferLimit = 15

  useEffect(() => {
      setLoading(true)
      getMainnetTransfers(transferLimit)
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
      getxDaiTransfers(transferLimit)
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
    setTransfers(tfrs.slice(0, transferLimit))
  }, [daitransfers, mainnetTransfers])

  return (
    <main id="site-main" role="main" className="app-content activity-main">
      <Helmet>
        <title>POAP Gallery - Activity</title>
        <link rel="canonical" href="https://poap.gallery/activity"/>
        <meta property="og:url" content="https://poap.gallery/activity"></meta>
        <meta property="og:title" content="POAP Gallery - Activity"></meta>
      </Helmet>
      <Foliage />
      <div className="activityContainer container" style={{
        maxWidth: 'none'
      }}>

        <div className="gallery-grid activity-grid" style={{ padding: '0 4rem', display: 'grid', justifyContent: 'center', gridAutoColumns: 295 }}>
          <EventCard event={mostRecent} size='m' type='most-recent' />
          <EventCard event={upcoming} size='m' type='upcoming' />
          <EventCard event={mostClaimed} size='m' type='most-claimed' />
        </div>

        <div className='table-container' style={{ marginTop: 50, display: 'flex', alignItems: 'center', overflowX: 'auto', maxWidth: 1000, marginLeft: `${width > 1000?'auto':'0'}`, marginRight: `${width > 1000?'auto':'0'}`}}>
          <CreateTable loading={loading} transfers={transfers} ></CreateTable>
        </div>

      </div>
    </main>
  )
}

function TokenRow({transfer, dateFormat}) {
  const type = (transfer.from?.id === '0x0000000000000000000000000000000000000000') ? 
                  (transfer.network === 'mainnet') ? 'Migration':'Claim'
                  : 'Transfer'
  const width = useWindowWidth();
  const [expanded, setExpanded] = useState(false)
  const toggleRowExpand = () => {
    setExpanded(!expanded)
  }
  const dateCell = (cell) => {
    if (dateFormat === 'date') {
      return dayjs(cell.value).format('D-MMM-YYYY').toUpperCase();
    }
    return dayjs(cell.value).fromNow()
  }
  return (
    width > 780
    ? <tr>
      {/* <td><a href={"https://app.poap.xyz/token/" + transfer.id} target="_blank"  rel="noopener noreferrer">{transfer.id}</a></td> */}
      <td className='recent-activity' style={{width:'100%'}}>
        {
          (type === 'Migration') ? <img src={Migration} alt="Migration" /> :
          (type === 'Claim') ?<img src={Claim} alt="Claim" /> :
          <img src={Transfer} alt="Transfer" />
        }
        <a
          href={"https://app.poap.xyz/token/"+transfer.token.id} target="_blank"  rel="noopener noreferrer">
          <img style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: '50%',
            margin: '0 24px 0 14px'
          }} src={`${POAP_API_URL}/token/${transfer.token.id}/image`} alt=""/>
        </a>
        <div className='recent-activity-content'>
          <div className='activity-type-pill'><Pill className={`${type}`} text={type} tooltip={false} /></div>
          <div className='time ellipsis'>{dayjs(transfer.timestamp * 1000).fromNow()}</div>
          <div className='description'>{
            (type === 'Migration') ? 'POAP migrated to mainnet' :
            (type === 'Claim') ? <span>New claim on event{' '}<Link to={`/event/${transfer.token.event.id}`}>#{transfer.token.event.id}</Link></span> :
            <span>POAP transferred from 
              <a href={`https://app.poap.xyz/scan/${transfer.from.id}`} target="_blank"  rel="noopener noreferrer"> {shrinkAddress(transfer.from.id, 10)} </a> to
              <a href={`https://app.poap.xyz/scan/${transfer.to.id}`} target="_blank"  rel="noopener noreferrer"> {shrinkAddress(transfer.to.id, 10)}</a>
            </span>
          }</div>
        </div>
      </td>
      <td className='ellipsis'><a href={"https://app.poap.xyz/token/" + transfer.token.id} target="_blank"  rel="noopener noreferrer">{'#'}{transfer.token.id}</a></td>
      <td style={{minWidth: '50px'}}><a href={"https://app.poap.xyz/scan/" + transfer.to.id} target="_blank"  rel="noopener noreferrer">
          <span>{shrinkAddress(transfer.to.id, 15)}</span>
        </a></td>
      <td> {transfer.token.transferCount && transfer.token.transferCount > 0 ? transfer.token.transferCount : 'Claimed'} </td>
      <td style={{wordBreak: 'break-all'}} > { dateCell(transfer.timestamp * 1000) } </td>
    </tr>
    : <tr>
      <td className='mobile-row'>
        <div className='recent-activity' style={{width:'100%'}}>
          {
            (type === 'Migration') ? <img src={Migration} alt="Migration" /> :
            (type === 'Claim') ?<img src={Claim} alt="Claim" /> :
            <img src={Transfer} alt="Transfer" />
          }
          {
            width > 430 &&
            <a
              href={"https://app.poap.xyz/token/"+transfer.token.id} target="_blank"  rel="noopener noreferrer">
              <img style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: '50%',
                margin: '0 24px 0 14px'
              }} src={`${POAP_API_URL}/token/${transfer.token.id}/image`} alt=""/>
            </a>
          }
          <div className='recent-activity-content'>
            <div className='activity-type-pill'><Pill className={`${type}`} text={type} tooltip={false} /></div>
            <div className='time ellipsis'>{dayjs(transfer.timestamp * 1000).fromNow()}</div>
            <div className='description'>{
              (type === 'Migration') ? 'POAP migrated to mainnet' :
              (type === 'Claim') ? <span> <span>New claim{' '}</span>
                on event{' '}<Link to={`/event/${transfer.token.event.id}`}>#{transfer.token.event.id}</Link></span> :
              <span>POAP transferred from 
                <a href={`https://app.poap.xyz/scan/${transfer.from.id}`} target="_blank"  rel="noopener noreferrer"> {shrinkAddress(transfer.from.id, 10)} </a> to
                <a href={`https://app.poap.xyz/scan/${transfer.to.id}`} target="_blank"  rel="noopener noreferrer"> {shrinkAddress(transfer.to.id, 10)}</a>
              </span>
            }</div>
          </div>
          <span className='expand-button' style={{width: `calc(100% - 180px${width>430?' - 118px':''})`}}><FontAwesomeIcon onClick={toggleRowExpand} icon={expanded? faArrowUp:faArrowDown} /></span>
        </div>
        <div className={`mobile-row-content ${expanded ? 'open' : ''}`}>
          <span className='id-title'>POAP ID</span><span className='id-content'><a href={"https://app.poap.xyz/token/" + transfer.token.id} target="_blank"  rel="noopener noreferrer">{'#'}{transfer.token.id}</a></span>
          <span className='address-title'>Owner</span><span className='address-content ellipsis'><a href={"https://app.poap.xyz/scan/" + transfer.to.id} target="_blank"  rel="noopener noreferrer">
              <span>{
                width>480
                ? shrinkAddress(transfer.to.id, 25)
                : shrinkAddress(transfer.to.id, 10)}
              </span>
            </a></span>
          <span className='tr-count-title'>Transaction Count</span><span className='tr-count-content'>{transfer.token.transferCount}</span>
          <span className='claim-title'>Minting Date</span><span className='claim-content'>{ dayjs(transfer.timestamp * 1000).format('D-MMM-YYYY').toUpperCase() }</span>
        </div>
      </td>
    </tr>
  )
}

function CreateTable({transfers, loading}) {
  const [dateFormat, setDateFormat] = useState('timeago')
  const width = useWindowWidth();
  const toggleDateFormat = () => {
    dateFormat === 'timeago' ? setDateFormat('date') : setDateFormat('timeago')
  }
  const tfers = []
  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i];
    tfers.push(<TokenRow key={t.id} transfer={t} dateFormat={dateFormat}></TokenRow>)
  }
  if (tfers && tfers.length) {
    tfers.push(
      width>780
      ?<tr><td/><td/><td/><td/><td/></tr>
      :<tr><td/></tr>)
  }
  return (
    <div style={{width: '100%'}} className='activity-table-container'>
      <table className="table" style={{ width: '100%', fontSize: '.93rem' }}>
        <thead>
          {
            width > 780
            ?<tr>
              <th style={{paddingLeft: '20px', textAlign: 'start'}}>Recent Activity</th>
              <th>POAP ID</th>
              <th>Collection</th>
              <th>TX count <FontAwesomeIcon icon={faQuestionCircle} data-tip="The amount of transactions this POAP has done since it the day it been claimed." /><ReactTooltip/> </th>
              <th>Minting Date <FontAwesomeIcon icon={faDotCircle} onClick={toggleDateFormat} data-tip="Toggle date format" style={{ width: '1rem', marginRight: '.2rem', cursor: 'pointer' }} /><ReactTooltip/></th>
            </tr>
            : <tr>
              <th style={{width: '100%'}}></th>
            </tr>
          }
        </thead>
        <tbody>
          {loading ? <tr style={{height: '600px', width: 'inherit'}}><td className="loading" colSpan="6"></td></tr> : tfers && tfers.length? tfers : (<tr><td style={{textAlign: 'center'}} colSpan="7">No Tokens Transferred</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
