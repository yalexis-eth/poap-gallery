export async function getEvents() {
  const res = await fetch('https://api.poap.xyz/events')
  return res.json()
}

export async function getMainnetEvents() {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
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

  return res.json()
}

export async function getxDaiEvents() {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
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

  return res.json()
}

export async function getxDaiTokens(eventId, first, skip) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        query: `
        {
          poapTokens(where:{ event: "${eventId}" }, first: ${first}, skip: ${skip}) {
            id
            transferCount
            created
            currentOwner {
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

export async function getMainnetTokens(eventId, first, skip) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        poapTokens(where:{ event: "${eventId}" }, first: ${first}, skip: ${skip}) {
          id
          transferCount
          created
          currentOwner {
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
        poapOwners(where:{ id_in: [${owners.map(owner => "\"" + owner + "\"").join(',')}] }, first: 1000) {
          id
          tokensOwned
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