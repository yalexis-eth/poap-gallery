const fetch = require('node-fetch')

fetch('https://api.thegraph.com/subgraphs/name/qu0b/poap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        query: `
        {
          poapTokens(first: 5) {
            id
            tokenId
            eventId
            owner
          }
        }
        `
      })
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('result', result)
        },
        (error) => {
          console.log('failed to query the graph',error)
        },
      );



