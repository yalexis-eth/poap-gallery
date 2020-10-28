export async function getEvents() {
  const res = await fetch('https://api.poap.xyz/events')
  const data = await res.json()
  return data
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
  const data = await res.json()

  return data
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
  const data = await res.json()

  return data
}

export async function getxDai(event) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/xdai', {
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
  const data = await res.json()
  return data
}

export async function getMainnet(event) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
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
  const data = res.json()
  return data
}

export async function getxDaiTransfer() {
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
  const data = res.json()
  return data
}

export async function getMainnetTransfer() {
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
  const data = res.json()
  return data
}
