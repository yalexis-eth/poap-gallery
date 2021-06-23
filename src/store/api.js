export const XDAI_SUBGRAPH_URL = process.env.REACT_APP_XDAI_SUBGRAPH_URL;
export const MAINNET_SUBGRAPH_URL = process.env.REACT_APP_MAINNET_SUBGRAPH_URL;
export const POAP_API_URL = process.env.REACT_APP_POAP_API_URL;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export async function getEvents() {
  const res = await fetch(`${POAP_API_URL}/events`)
  return res.json()
}

export async function getEvent(id) {
  const res = await fetch(`${POAP_API_URL}/events/id/${id}`)
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
          transferCount
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
          },
          event(id: "${eventId}"){
            tokenCount
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

export async function getLayerOwners(owners, url) {
  const owners_id = owners.map(owner => "\"" + owner + "\"").join(',')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        accounts(where:{id_in: [${owners_id}]}) {
          id
          tokensOwned
        }
      }
      `
      })
  })
  return res.json()
}

export async function getXDaiOwners(owner) {
  return getLayerOwners(owner, XDAI_SUBGRAPH_URL);
}

export async function getMainnetOwners(owner) {
  return getLayerOwners(owner, MAINNET_SUBGRAPH_URL);
}

export async function getLayerTransfers(amount, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
          {
            transfers(first: ${amount}, orderBy: timestamp, orderDirection: desc) {
              id
              token {
                id
                transferCount
                event {
                  id
                }
              }
              from {
                id
              }
              to {
                id
              }
              timestamp
            }
          }
          `
    })
  })
  return res.json()
}

export async function getxDaiTransfers(amount) {
  return getLayerTransfers(amount, XDAI_SUBGRAPH_URL);
}

export async function getMainnetTransfers(amount) {
  return getLayerTransfers(amount, MAINNET_SUBGRAPH_URL);
}

export async function getMigrations(amount) {
  // Step 1: get most recently minted tokens in mainnet (since POAP only mints on layer 2, it's safe to assume they were migrated)
  const res = await fetch(MAINNET_SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
          {
            tokens(first: ${amount}, orderBy: created, orderDirection: desc) {
              id
              owner {
                id
              }
              event {
                id
              }
              transfers {
                id
              }
              created
            }
          }
          `
    })
  })
  return res.json()
}

export async function validateMigrations(migrations) {
  // Step 2: Verify the minted tokens have a burned counterpart in layer 2
  // TODO: add polygon check when we implement POAPs in the polygon chain
  const ids = migrations.map(t => "\"" + t.id + "\"").join(',')
  const res2 = await fetch(XDAI_SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
          {
            tokens(where: {id_in: [${ids}]}) {
              id
              owner {
                id
              }
              event {
                id
              }
              transfers {
                id
              }
              created
            }
          }
          `
    })
  })
  return res2.json()
}