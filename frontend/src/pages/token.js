import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import PoapLogo from '../assets/images/POAP.svg';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faGlasses } from '@fortawesome/free-solid-svg-icons'



export default function Tokens() {
  let match = useRouteMatch();
  console.log('matched route:', match);

  return (
    <Switch>
      <Route path={`${match.path}/:tokenId`}>
        <Token />
      </Route>
      <Route path={match.path}>
        <h3>No token Selected</h3>
      </Route>
    </Switch>
  );
}

export function Token() {
  const params = useParams();
  let { tokenId } = params;

  const [event, setEvent] = useState({});
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then(
        (result) => {
          result = result.filter((event) => event.id + '' === tokenId);

          setIsLoaded(true);
          if (result && result.length) {
            setEvent(result[0]);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        },
      );
  }, []);

  return (
    <main id="site-main" role="main" className="app-content">
      <div
        className="container"
        style={{
          padding: '0rem',
        }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: '0 2rem',
          alignContent: 'space-around',
          justifyContent: 'space-around',
        }}> 
      
          <div style={{display: 'flex', flexDirection: "column", justifyContent: "space-between"}}>
          <div style={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}> 
          <FontAwesomeIcon icon={faAngleLeft}> </FontAwesomeIcon> 
          <h4> Event Id: {tokenId}   </h4>
          <FontAwesomeIcon icon={faAngleRight}> </FontAwesomeIcon>
          </div>
          <div style = {{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}> <TokenCard event={event} />  </div>

          </div>
          <div style={{maxWidth: '500px', overflowWrap: 'anywhere'}}>
            {tokenDetails(event)}
          </div>
        </div>
      <div style={{display: 'flex', justifyContent:'center',textAlign: 'center', margin: '0 1rem'}}>
        <div style={{maxWidth: '50rem'}}>{event.description}</div> 
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 1rem' }}>
          <table className="activityTable" style={{ width: '100%', border: 'none' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Owner</th>
                <th>Claim date</th>
                <th>Transfer count</th>
                <th>POAP Power <FontAwesomeIcon icon={faQuestionCircle} data-tip="Total amount of unique POAPs held by this address" /> <ReactTooltip /> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ABC2 </td>
                <td>0xb4367dc4d2</td>
                <td> Inan</td>
                <td> 100 </td>
              </tr>
              <tr>
                <td>2</td>
                <td>ABC POAP</td>
                <td>0xb4367dc4de</td>
                <td>0xb4367dc4d2</td>
                <td> 100 </td>
              </tr>
              <tr>
                <td>3</td>
                <td>ABC PP3</td>
                <td>0xb4367dc4de</td>
                <td>Stefan.eth</td>
                <td> 100 </td>
              </tr>
              <tr>
                <td>4</td>
                <td>ABC 1</td>
                <td>Max.eth</td>
                <td>Alexander.eth</td>
                <td> 100 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function TokenCard({ event }) {
  return (
    <div
      style={{
        borderRadius: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem 0rem',
        maxWidth: '300px',
      }}
    > 
      <div 
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '150px',
          height: '150px',
        }}
      >
        <img
          style={{
            width: 'auto',
            height: '100%',
            borderRadius: '50%'
          }}
          src={event.image_url}
          alt="POAP"
        />
      </div>
      <div>
        <h3
        title={event.name}
        className="h4"
        style={{
          fontSize: '1.15rem',
          textAlign: 'center',
          margin: '.8rem 0',
          overflowWrap: 'anywhere',
        }}
        >{event.name}</h3>
      </div>
      <div></div>
    </div>
  );
}

function tokenDetails(event) {
  let array1 = [
    { value: event.country, key: 'Country' },
    { value: event.start_date, key: 'Start date' },
    { value: event.end_date, key: 'End date' },
    { value: event.event_url, key: 'Website', render: (value) => {
      let host = new URL(value).hostname
      return (
      <a href={value} className="href">{host}</a>
      )
    } },
    // { value: event.description, key: 'Description' },
  ];
  let array2 = [];

  for (let i = 0; i < array1.length; i++) {
    if(array1[0].value == ''){
      array1[0].value = <span> Virtual event  <FontAwesomeIcon icon={faGlasses}></FontAwesomeIcon> </span>
    }
    if(array1[1].value == array1[2].value){
      array1[1].value = null;
      array1[2] = {value: event.end_date, key: 'Date'} 
    } //todo: if 1 == 2 , it pushes the the table down
    if(array1[i].value){
      let e = (
        <div style={{ display: 'flex'}}>
          <h4 style={{ flex: '0 0 120px'}}> {array1[i].key} </h4>
          <div style={{ flex: '1 1', minWidth: '220px'}}> {array1[i].render ? array1[i].render(array1[i].value) : array1[i].value} </div>
        </div>
      );
      array2.push(e);
    }
  }
  console.log(array2);
  return array2;
}

/*
  
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Description </h4> </div>  <div style={{marginLeft: "3rem"}}> {event.description} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Virtual Event </h4> </div>  <div style={{marginLeft: "3rem"}}> {event.virtual_event} </div> </div>
   { event.country ? <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Country  </h4> </div>  <div style={{marginLeft: "3rem"}}> {event.country} </div> </div> : null}
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Start date </h4> </div>  <div style={{marginLeft: "3rem"}}>{event.start_date} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> End date </h4> </div>  <div style={{marginLeft: "3rem"}}>{event.end_date} </div> </div>
        <div style={{display: "flex", flexDirection: "row"}}> <div style={{width: "100px", marginLeft: "1rem"}}> <h4> Website </h4> </div>  <div style={{marginLeft: "3rem"}}> {event.event_url} </div> </div>

        */
