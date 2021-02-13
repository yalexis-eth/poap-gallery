import { getxDaiEvents, getMainnetTokens, getEvents, getMainnetEvents, getxDaiTokens, MainnetCrossReferenceXDai, xDaiCrossReferenceMainnet} from './api'
// import { useDispatch } from 'react-redux'
import { uniq, uniqBy } from 'lodash'

export async function getIndexPageData() {
  let [poapEvents, graphEvents, xdaiEvents] = await Promise.all([getEvents(), getMainnetEvents(), getxDaiEvents()])

  if (graphEvents && graphEvents.data && graphEvents.data.poapEvents) {
    graphEvents = graphEvents.data.poapEvents
  } else {
    graphEvents = []
  }

  if (xdaiEvents && xdaiEvents.data && xdaiEvents.data.poapEvents) {
    xdaiEvents = xdaiEvents.data.poapEvents
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
            if (parseInt(t.currentOwner.tokensOwned) < 0) {
              continue
            }
            ev.power += parseInt(t.currentOwner.tokensOwned)
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
    let [mainnet, xDai] = await Promise.all([getMainnetTokens(eventId, first, skip), getxDaiTokens(eventId, first, skip)])
    let tokens = []
    let owners = []


    if (mainnet && mainnet.data && mainnet.data.poapTokens && mainnet.data.poapTokens.length) {
      tokens = tokens.concat(mainnet.data.poapTokens)
    }

    if (xDai && xDai.data && xDai.data.poapTokens && xDai.data.poapTokens.length) {
      tokens = tokens.concat(xDai.data.poapTokens)
    }

    for (let i = 0; i < tokens.length; i++) {
      owners.push(tokens[i].currentOwner.id)
    }

    owners = uniq(owners)


    const [mainnetOwners, xDaiOwners] = await Promise.all([MainnetCrossReferenceXDai(owners), xDaiCrossReferenceMainnet(owners)])


    owners = {}

    if (mainnetOwners && mainnetOwners.data && mainnetOwners.data.poapOwners) {
      for (let i = 0; i < mainnetOwners.data.poapOwners.length; i++) {
        const owner = mainnetOwners.data.poapOwners[i];
        owners[owner.id] = {
          tokens: owner.tokens.map(token => token.id)
        }
      }
    }

    if (xDaiOwners && xDaiOwners.data && xDaiOwners.data.poapOwners) {
      for (let i = 0; i < xDaiOwners.data.poapOwners.length; i++) {
        const owner = xDaiOwners.data.poapOwners[i];
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
      if (owners[tokens[j].currentOwner.id] !== undefined ) {
        tokens[j].currentOwner.tokensOwned = owners[tokens[j].currentOwner.id].tokensOwned
      } else {
        console.log("NOT FOUND", tokens[j].currentOwner.id, tokens[j].currentOwner.tokensOwned)
      }
    }

    return { id: eventId, tokens: uniqBy(tokens, 'id').sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id)
    }) }
}


export function getTransactionPageData() {

}
