import React, { useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { ROUTES } from './routes'
// import './App.css';
import './scss/main.scss'
import Gallery from './pages/gallery'
import Activity from './pages/activity'
import Tokens from './pages/token'


import Header from './components/header'
import Footer from './components/footer'

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  document.body.className = 'poap-app'
  let it = []

  try {
    // it = JSON.parse(localStorage.getItem('combined_events') || JSON.parse(localStorage.getItem('poap_events'))) || []
   } catch(e) {
   }
    const [items, setItems] = useState(it);
    const [mostRecent, setMostRecent] = useState({});
    const [upcoming, setUpcoming] = useState({});
    const [mostClaimed, setMostClaimed] = useState({});
    const [highestPoapPower, setHighestPoapPower] = useState({});

  const combineEvents = () => {
    const poapEvents = JSON.parse(localStorage.getItem('poap_events'))
    const graphEvents = JSON.parse(localStorage.getItem('graph_events'))

    let mr = {}
    let up = {}
    let mC = {}
    let hPP = {}
    
    if(poapEvents && poapEvents.length) {
      mr = poapEvents[0]
      up = poapEvents[0]
      mC = poapEvents[0]
      hPP = poapEvents[0]
    }
    let isMostRecent = false


    for (let i = 0; i < poapEvents.length; i++) {
      const ev = poapEvents[i];
      for (let j = 0; j < graphEvents.length; j++) {
        const gev = graphEvents[j];
        if(ev.id === parseInt(gev.id)) {
          ev.tokenCount = parseInt(gev.tokenCount)
          ev.transferCount = 0
          ev.power = 0
          for (let k = 0; k < gev.tokens.length; k++) {
            const t = gev.tokens[k];
            if (parseInt(t.currentOwner.tokensOwned) < 0) {
              continue
            }
            ev.power += parseInt(t.currentOwner.tokensOwned)
            ev.transferCount += parseInt(t.transferCount)
          }
        }
      }
      let now = new Date().getTime()
      let evDate = new Date(ev.start_date).getTime()
      
      
      if(evDate > now) {
        up = ev
      }

      if(evDate < now && isMostRecent === false) {
        isMostRecent = true
        mr = ev
      }
      
      if(ev.tokenCount > mC.tokenCount) {
        mC = ev
      }
      if (ev.power > hPP.power) {
        hPP = ev
      }
    }

    mr.heading = "Most Recent"
    up.heading = "Upcoming Event"
    mC.heading = "Most Claimed Token"
    hPP.heading = "Highest Poap Power"

    setMostRecent(mr)
    setUpcoming(up)
    setMostClaimed(mC)
    setHighestPoapPower(hPP)

    localStorage.setItem('combined_events', JSON.stringify(poapEvents))
    setItems(poapEvents)
  }


  useEffect(() => {
    fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
      {
        poapEvents(orderBy: id, orderDirection: desc, first: 1000) {
          id
          tokenCount
          tokens {
            transferCount
            currentOwner {
              tokensOwned
            }
          }
        }
      }
      `
    })
  })
  .then(res => res.json())
  .then(({data}) => {
    let oldItems = JSON.parse(localStorage.getItem('graph_events')) || []
    if(data && data.poapEvents) {
      localStorage.setItem('graph_events', JSON.stringify(data.poapEvents))
    }

    if(data && oldItems.length !== data.poapEvents) {
      if(JSON.parse(localStorage.getItem('poap_events'))) {
        combineEvents()
      } else {
        console.log('poapevents not loaded')
      }
    }
  })
  .catch(err => {
    setError(err)
    console.log('could not query thegraph', err)
  })
}, [])

useEffect(() => {
    if(!(items && items.length)) {
      setIsLoaded(false)
    }
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then((result) => {
        if(result.length > items.length) {
          setItems(result);
        }
        localStorage.setItem('poap_events', JSON.stringify(result));
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setIsLoaded(true)
        console.log(err);
      });
}, []);


  return (
    <BrowserRouter>
    <div className="landing">
      <Header />
      <Switch>
        <Route path={ROUTES.token}>
          <Tokens events={items} />
        </Route>
        <Route path={ROUTES.activity}>
          <Activity mostClaimed={mostClaimed} upcoming={upcoming} mostRecent={mostRecent} highestPoapPower={highestPoapPower} events={items} />
        </Route>
        <Route  path={ROUTES.home}>
          <Gallery error={error} isLoaded={isLoaded} events={items} />
        </Route>
      </Switch>
    <Footer />
    </div>
    </BrowserRouter>
  );
}


export default App;
