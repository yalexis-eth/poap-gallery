export const XDAI_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai';
export const MAINNET_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap';
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
              id
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

export async function crossReference(owners, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        accounts(where:{ id_in: [${owners.map(owner => "\"" + owner + "\"").join(',')}] }, first: 1000) {
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

export async function MainnetCrossReferenceXDai(owner) {
  return crossReference(owner, XDAI_SUBGRAPH_URL);
}

export async function xDaiCrossReferenceMainnet(owner) {
  return crossReference(owner, MAINNET_SUBGRAPH_URL);
}