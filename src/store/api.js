export const XDAI_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-sokol';
export const MAINNET_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-ropsten';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export async function getEvents() {
  const res = await fetch('https://api.poap.xyz/events')
  return res.json()
}

export async function getLayerEvents(url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        events(orderBy: id, orderDirection: desc, first: 1000) {
          id
          tokenCount
          tokens {
            id
            transferCount
            owner {
              tokensOwned
              tokens(first: 1000) {
                id
              }
            }
          }
        }
      }
      `
    })
  })

	return res.json()
}

export async function getMainnetEvents() {
  return getLayerEvents(MAINNET_SUBGRAPH_URL);
}

export async function getxDaiEvents() {
	return getLayerEvents(XDAI_SUBGRAPH_URL);

}

export async function getLayerTokens(eventId, first, skip, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
        {
          tokens(where:{ event: "${eventId}",  owner_not: "${ZERO_ADDRESS}"}, first: ${first}, skip: ${skip}) {
            id
            transferCount
            created
            owner {
              id
              tokensOwned
            }
          }
        }
        `
		})
	})
	return res.json()
}


export async function getxDaiTokens(eventId, first, skip) {
  return getLayerTokens(eventId, first, skip, XDAI_SUBGRAPH_URL);
}

export async function getMainnetTokens(eventId, first, skip) {
	return getLayerTokens(eventId, first, skip, MAINNET_SUBGRAPH_URL);
}

export async function getxDaiTransfers() {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
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
  return res.json()
}

export async function getMainnetTransfers() {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
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
  return res.json()
}


export async function xDaiCrossReferenceMainnet(owners) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        poapOwners(where:{ id_in: [${owners.map(owner => "\"" + owner + "\"").join(',')}] }, first: 1000) {
          id
          tokensOwned
          tokens {
            id
          }
        }
      }
      `
      })
  })
  return res.json()
}

export async function MainnetCrossReferenceXDai(owners) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        owners(where:{ id_in: [${owners.map(owner => "\"" + owner + "\"").join(',')}] }, first: 1000) {
          id
          tokensOwned
          tokens {
            id
          }
        }
      }
      `
    })
  })
  return res.json()
}


// xDaiCrossReferenceMainnet(xDaiTokens.map(token => token.currentOwner.id))
// .then(
//   (result) => {
//     if(result && result.data && result.data.poapOwners && result.data.poapOwners.length) {
//       let tkns = result.data.poapOwners.map(owner => {
//         owner.currentOwner = {id: owner.id, tokensOwned: owner.tokensOwned }
//         return owner
//       })
//       console.log('MAINNET EVENT DOES NOT EXIST', tkns)
//       setMainnetTokens(tkns)
//     }
//   },
//   (error) => {
//     console.log('failed to query the graph',error)
//   },
// );