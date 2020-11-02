import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faLaptop } from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet'



export default function Events({ events, error, isLoaded }) {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:eventId`}>
        <Event error={error} isLoaded={isLoaded} events={events} />
      </Route>
      <Route path={match.path}>
        <h3>No event Selected</h3>
      </Route>
    </Switch>
  );
}

export function Event({ events }) {
  const params = useParams();
  let { eventId } = params;

  const [event, setEvent] = useState({});
  const [tokens, setTokens] = useState([]);
  const [xDaiTokens, setxDaiTokens] = useState([]);
  const [mainnetTokens, setMainnetTokens] = useState([]);
  


  useEffect(() => {
    let result = events.filter((event) => event.id + '' === eventId);
    if(result && result.length) {
      setEvent(result[0]);
    }
  }, [events, eventId])

  useEffect(() => {
    fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        query: `
        {
          poapEvents(where:{ id: ${eventId} }) {
            id
            tokens {
              id
              transferCount
              created
              currentOwner {
                id
                tokensOwned
              }
            }
          }
        }
        `
      })
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if(result && result.data && result.data.poapEvents && result.data.poapEvents.length) {
            
            let tkns = result.data.poapEvents[0].tokens
            // let length = result.data.poapEvents[0].tokens.length
            setMainnetTokens(tkns)

            // if (length > 10) {
            //   length = 10
            // }
            
            // for (let i = 0; i < length; i++) {
            //   const element = result.data.poapEvents[0].tokens[i];
            //   // owners.push(element.currentOwner.id)
            //   fetch("https://api.poap.xyz/actions/ens_lookup/"+element.currentOwner.id)
            //   .then(res => res.json())
            //   .then(({ens}) => {
            //     if(ens) {
            //       tkns[i].ens = ens
            //       setTokens(tkns)
            //     }
            //   })
            // }
          }
        },
        (error) => {
          console.log('failed to query the graph',error)
        },
      );
  }, [eventId]);

  useEffect(() => {
    fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        query: `
        {
          poapEvents(where:{ id: ${eventId} }) {
            id
            tokens {
              id
              transferCount
              created
              currentOwner {
                id
                tokensOwned
              }
            }
          }
        }
        `
      })
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if(result && result.data && result.data.poapEvents && result.data.poapEvents.length) {
            
            let tkns = result.data.poapEvents[0].tokens
            // let length = result.data.poapEvents[0].tokens.length
            setxDaiTokens(tkns)
          }
        },
        (error) => {
          console.log('failed to query the graph',error)
        },
      );
  }, [eventId]);

  useEffect(() => {
    const tokenMap = {}
    for (let i = 0; i < mainnetTokens.length; i++) {
      const token = mainnetTokens[i];
      if(tokenMap[token.currentOwner.id] === undefined) {
        tokenMap[token.currentOwner.id] = token
      } else {
        tokenMap[token.currentOwner.id].currentOwner.tokensOwned = '' + (parseInt(token.currentOwner.tokensOwned) + parseInt(tokenMap[token.currentOwner.id].currentOwner.tokensOwned)) 
      }
    }
    for (let j = 0; j < xDaiTokens.length; j++) {
      const token = xDaiTokens[j]
      if(tokenMap[token.currentOwner.id] === undefined) {
        tokenMap[token.currentOwner.id] = token
      } else {
        
        tokenMap[token.currentOwner.id].currentOwner.tokensOwned = '' + (parseInt(token.currentOwner.tokensOwned) + parseInt(tokenMap[token.currentOwner.id].currentOwner.tokensOwned)) 
      }
    }
    const tkns = Object.values(tokenMap)
    setTokens(tkns)
  }, [mainnetTokens, xDaiTokens])

  return (
    <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Event</title>
        <link rel="canonical" href={"https://poap.gallery/event/" + eventId}/>
        <meta property="og:url" content={"https://poap.gallery/event/" + eventId }></meta>
        <meta property="og:title" content="POAP Gallery - Event"></meta>
      </Helmet>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap',
          alignContent: 'space-around',
          justifyContent: 'space-around',
        }}>
          <div style={{flex: '0 0 18rem', display: 'flex', flexDirection: "column", justifyContent: "center"}}>
            <div style={{display: 'flex', justifyContent: "space-between"}}> 
              <a href={parseInt(eventId)-1} ><FontAwesomeIcon icon={faAngleLeft}> </FontAwesomeIcon> </a>
              <h4 style={{marginBottom: '0'}}> Event Id: {eventId} </h4>
              <a href={parseInt(eventId)+1} ><FontAwesomeIcon icon={faAngleRight}> </FontAwesomeIcon></a>
            </div>
            <div style={{minHeight: '200px', margin: '0 auto'}}>
              <TokenCard event={event} />
            </div>
          </div>
          <div style={{flex: '1 1 18rem', maxWidth: '500px', overflowWrap: 'anywhere'}}>
            {tokenDetails(event)}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent:'center',textAlign: 'center'}}>
          <div style={{maxWidth: '50rem'}}>{event.description}</div> 
        </div>
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'auto' }}>
          <CreateTable tokens={tokens} ></CreateTable>
        </div>
      </div>
    </main>
  );
}

function TokenRow({token}) {
  return (
    <tr>
      <td><a href={"https://app.poap.xyz/token/" + token.id}>{token.id}</a></td>
      <td><a href={"https://app.poap.xyz/scan/" + token.currentOwner.id}> {token.ens ? token.ens : token.currentOwner.id} </a></td>
      <td> {new Date(token.created * 1000).toLocaleDateString()} </td>
      <td> {token.transferCount}</td>
      <td> {token.currentOwner.tokensOwned} </td>
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
                <th>ID</th>
                <th>Owner</th>
                <th>Claim date</th>
                <th>Tx count</th>
                <th>POAP Power <FontAwesomeIcon icon={faQuestionCircle} data-tip="Total amount of POAPs held by this address" /> <ReactTooltip /> </th>
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
    <div
      style={{
        borderRadius: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem 0rem',
        width: '300px',
      }}
    > 
      <div 
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden'
        }}
      >
        <img
          style={{
            width: '100%',
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
    { value: event.city, key: 'City' },
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
    if(array1[0].value === ''){
      array1[0].value = <span> Virtual event  <FontAwesomeIcon icon={faLaptop}></FontAwesomeIcon> </span>
    }
    if(array1[1].value === array1[2].value){
      //array1.shift();
      array1[1].value = null;
      array1[2] = {value: event.end_date, key: 'Date'} 
    } //todo: if 1 == 2 , it pushes the the table down
    if(array1[i].value){
      let e = (
        <div key={i} style={{ display: 'flex', padding: '0 1rem'}}>
          <h4 style={{ flex: '0 0 7rem'}}> {array1[i].key} </h4>
          <div style={{ flex: '1 1 8rem'}}> {array1[i].render ? array1[i].render(array1[i].value) : array1[i].value} </div>
        </div>
      );
      array2.push(e);
    }
  }
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
