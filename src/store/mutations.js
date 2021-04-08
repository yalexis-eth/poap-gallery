import {
  getEvent,
  getEvents,
  getMainnetEvents,
  getMainnetTokens,
  getxDaiEvents,
  getxDaiTokens,
  MainnetCrossReferenceXDai,
  xDaiCrossReferenceMainnet,
  ZERO_ADDRESS
} from './api'
import {uniq, uniqBy} from 'lodash'

export async function getIndexPageData() {
  let [poapEvents, graphEvents, xdaiEvents] = await Promise.all([getEvents(), getMainnetEvents(), getxDaiEvents()])

  if (graphEvents && graphEvents.data && graphEvents.data.events) {
    graphEvents = graphEvents.data.events
  } else {
    graphEvents = []
  }

  if (xdaiEvents && xdaiEvents.data && xdaiEvents.data.events) {
    xdaiEvents = xdaiEvents.data.events
    graphEvents = graphEvents.concat(xdaiEvents)
  }

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
      ev.tokenCount = 0
      ev.transferCount = 0
      ev.power = 0
      for (let j = 0; j < graphEvents.length; j++) {
        const gev = graphEvents[j];
        if(ev.id === parseInt(gev.id)) {
          ev.tokenCount += parseInt(gev.tokenCount)
          for (let k = 0; k < gev.tokens.length; k++) {
            const t = gev.tokens[k];
            if (parseInt(t.owner.tokensOwned) < 0 || t.owner.id === ZERO_ADDRESS) {
              continue
            }
            ev.power += parseInt(t.owner.tokensOwned)
            ev.transferCount += parseInt(t.transferCount)
          }
        }
      }
      let now = new Date().getTime()
      let evDate = new Date(ev.start_date.replace(/-/g, ' ')).getTime()


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

    return {
      poapEvents: poapEvents,
      mostRecent: mr,
      mostClaimed: mC,
      upcoming: up,
      highestPoapPower: hPP,
    }
}


export async function getEventPageData(eventId, first, skip) {
    let [mainnet, xDai, event] = await Promise.all([getMainnetTokens(eventId, first, skip), getxDaiTokens(eventId, first, skip), getEvent(eventId)])
    let tokens = []
    let owners = []

    event.tokenCount = 0;

    if (mainnet && mainnet.data) {
      if(mainnet.data.tokens && mainnet.data.tokens.length)
        tokens = tokens.concat(mainnet.data.tokens)

      if(mainnet.data.event && mainnet.data.event.tokenCount)
        event.tokenCount += parseInt(mainnet.data.event.tokenCount);
    }
  
    if (xDai && xDai.data) {
      if(xDai.data.tokens && xDai.data.tokens.length)
        tokens = tokens.concat(xDai.data.tokens);

      if(xDai.data.event && xDai.data.event.tokenCount)
        event.tokenCount += parseInt(xDai.data.event.tokenCount);
    }

    for (let i = 0; i < tokens.length; i++) {
      owners.push(tokens[i].owner.id)
    }

    owners = uniq(owners)


    const [mainnetOwners, xDaiOwners] = await Promise.all([MainnetCrossReferenceXDai(owners), xDaiCrossReferenceMainnet(owners)])


    owners = {}
  
    if (mainnetOwners && mainnetOwners.data && mainnetOwners.data.accounts) {
      for (let i = 0; i < mainnetOwners.data.accounts.length; i++) {
        const owner = mainnetOwners.data.accounts[i];
        owners[owner.id] = {
          tokens: owner.tokens.map(token => token.id)
        }
      }
    }
  
    if (xDaiOwners && xDaiOwners.data && xDaiOwners.data.accounts) {
      for (let i = 0; i < xDaiOwners.data.accounts.length; i++) {
        const owner = xDaiOwners.data.accounts[i];
        if (owners[owner.id] === undefined) {
          owners[owner.id] = {
            tokens: owner.tokens.map(token => token.id)
          }
        } else {
          owners[owner.id].tokens =  owners[owner.id].tokens.concat(owner.tokens.map(token => token.id) )
        }
      }
    }

    for (const [key, value] of Object.entries(owners)) {
      owners[key].tokensOwned = uniq(value.tokens).length
    }

    for (let j = 0; j < tokens.length; j++) {
      if (owners[tokens[j].owner.id] !== undefined ) {
        tokens[j].owner.tokensOwned = owners[tokens[j].owner.id].tokensOwned
      } else {
        console.log("NOT FOUND", tokens[j].owner.id, tokens[j].owner.tokensOwned)
      }
    }
    return { id: eventId, event, tokens: uniqBy(tokens, 'id').sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id)
    }) }
}