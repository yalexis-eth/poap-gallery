import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {getMainnetTransfers, getxDaiTransfers, POAP_API_URL} from "../store/api";
import { Pill } from './pill';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import TransferIcon from '../assets/images/transfer-icon.svg'
import ClaimIcon from '../assets/images/claim-icon.svg'
import MigrateIcon from '../assets/images/migrate-icon.svg'


dayjs.extend(relativeTime)


export default function ActivityTable() {

  const [loading, setLoading] = useState(false)
  const [transfers, setTransfers] = useState([])
  const [daitransfers, setDaiTransfers] = useState([])
  const [mainnetTransfers, setMainnetTransfers] = useState([])
  const transferLimit = 3
  
  useEffect(() => {
    setLoading(true)
    getMainnetTransfers(transferLimit)
      .then(
        (result) => {
          let tfrs = result.data.transfers
          tfrs.map(t => t.network = "mainnet")
          setMainnetTransfers(tfrs)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.log('failed to query the graph', error)
        },
      );
  }, []);

  useEffect(() => {
    setLoading(true)
    getxDaiTransfers(transferLimit)
      .then(
        (result) => {
          let tfrs = result.data.transfers
          tfrs.map(t => t.network = "xDai")
          setDaiTransfers(tfrs)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.log('failed to query the graph', error)
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
    <div className="activity-table"
         style={{display: "flex", flexDirection: "column", justifyContent: "center", fontSize: '.89rem'}}>
      <div className="activity-table-title">POAP Gallery</div>
      <div className="activity-table-subtitle">Explore all the beautiful badges that have been created and claimed throughout the history of POAP</div>
      <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Transfers loading={loading} transfers={transfers}></Transfers>
      </div>
      <div style={{display: "flex", justifyContent: "center", margin: '.5rem 0'}}><Link to="/activity">
        <FontAwesomeIcon icon={faClock} />
        {' '}View more activity
      </Link></div>
    </div>
  )
}

function Transfer({transfer}) {
  const type = transferType(transfer)
  return (
    <div className='transfer'>
      <div className='dashed-line min-sw' style={{height: `${transfer.opacity === 0.3 ? '0' : 'inherit'}`}}></div>
      <img style={{width: `37px`, zIndex: 2}} className='min-sw' src={type==='Transfer'? TransferIcon: type==='Claim'? ClaimIcon:MigrateIcon} alt={type} />
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <a href={"https://app.poap.xyz/token/" + transfer.token.id} target="_blank" style={{margin: '.8rem 0', opacity: transfer.opacity}} className={`round-box ${transfer.opacity===1? 'first':''}`} rel="noopener noreferrer">
          <div className='round-box-image'>
            <img style={{
              objectFit: 'cover',
              borderRadius: '50%'
            }} src={`${POAP_API_URL}/token/${transfer.token.id}/image`} alt=""/>
          </div>
          {/* <div style={{overflow: 'hidden', display: 'flex', flexDirection: 'row'}}> */}
            <div className='round-box-content'>
              <Pill text={type} className={type} />
              {
                (type === 'Claim')?
                <span> New claim on event
                  {' '}<Link to={`/event/${transfer.token.event.id}`}>#{transfer.token.event.id}</Link>
                </span> :
                (type === 'Transfer')?
                <span>POAP transferred from
                  <a href={"https://app.poap.xyz/scan/" + transfer.from.id} target="_blank"  rel="noopener noreferrer"> {transfer.from.id.substring(0, 8) + '…'} </a> to 
                  <a href={"https://app.poap.xyz/scan/" + transfer.to.id} target="_blank"  rel="noopener noreferrer"> {transfer.to.id.substring(0, 8) + '…'} </a>
                  {/* on {transfer.network} */}
                </span> :
                (type === 'Migration')?
                <span> POAP migrated to 
                  <a href={"https://app.poap.xyz/scan/" + transfer.to.id} target="_blank"  rel="noopener noreferrer"> {transfer.to.id.substring(0, 16) + '…'} </a>
                  on mainnet
                </span> :
                null
              }

            </div>
            <div className='round-box-time min-m'>
              {dayjs(transfer.timestamp * 1000).fromNow()}
            </div>
          {/* </div> */}
        </a>
      </div>
    </div>
  )
}

function Transfers({transfers, loading}) {
  const tfers = []
  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i];
    t.opacity = i===0? 1.0: i===1? 0.7: 0.3;
    tfers.push(<Transfer key={t.id} transfer={t}></Transfer>)
  }
  return tfers
}

const transferType = (transfer) => {
  return (transfer.from?.id === '0x0000000000000000000000000000000000000000') ? 
          (transfer.network === 'mainnet') ? 'Migration':'Claim'
          : 'Transfer'
};
