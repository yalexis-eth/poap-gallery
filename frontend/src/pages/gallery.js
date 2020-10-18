import React, { useState, useEffect } from 'react';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCoins, faFire, faGlobe, faLaptop, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Gallery() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
 //JSON.parse(localStorage.getItem('poap_events')) ||
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('combined_events') || JSON.parse(localStorage.getItem('poap_events'))) || []);
  // const [items, setItems] = useState([]);
  const [search, setSearch] = useState([]);
  const [length, setLength] = useState(50);
  // false is descending true is ascending
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortVariable, setSortVariable] = useState('date');

  const combineEvents = () => {
    const poapEvents = JSON.parse(localStorage.getItem('poap_events'))
    const graphEvents = JSON.parse(localStorage.getItem('graph_events'))

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
    }
    localStorage.setItem('combined_events', JSON.stringify(poapEvents))
    setItems(poapEvents)
  }

  const handleSearch = (event) => {
    const value = event.target.value;
    if (value && value.length) {
      const filteredItems = items.filter((item) => {
        return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
      setSearch(filteredItems);
    } else {
      setSearch([]);
    }
  };

  const filterDirection = (ev) => {
    setSortOrder(ev.target.value);
    handleFilter(sortVariable, ev.target.value);
  };

  const filterType = (ev) => {
    setSortVariable(ev.target.value);
    handleFilter(ev.target.value, sortOrder);
  };

  const handleFilter = (type, direction) => {
    let isAsc = direction === 'asc'
    let sortedItems = [...items]
    if (type === 'date') {
      sortedItems.sort((a, b) => {
        return isAsc
          ? new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          : new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });
    } else if(type === 'id') {
      sortedItems.sort((a, b) => {
        return isAsc ? a.id - b.id : b.id - a.id
      })
    } else if (type === 'city') {
      sortedItems.sort((a, b) => {
        a = a.city.trim().toLowerCase()
        b = b.city.trim().toLowerCase()

        if(a === "") {
          return 1
        }

        if (b === "") {
          return -1
        }
        
 
        if( a > b ) {
          return isAsc ? 1 : -1
        } else if(b > a) {
          return isAsc ? -1 : 1
        } else {
          return 0
        }
      })
    } else if (type === 'holders') {
      sortedItems.sort((a, b) => {
        if(a.tokenCount === undefined) {
          a.tokenCount = 0
        }
        if(b.tokenCount === undefined) {
          b.tokenCount = 0
        }
        if(a.tokenCount > b.tokenCount) {
          return isAsc ? 1 : -1
        } else if (b.tokenCount > a.tokenCount) {
          return isAsc ? -1 : 1
        } else {
          return 0
        }
      });
    } else if (type === 'transfers') {
      sortedItems.sort((a, b) => {
        if(a.transferCount === undefined) {
          a.transferCount = 0
        }
        if(b.transferCount === undefined) {
          b.transferCount = 0
        }
        if(a.transferCount > b.transferCount) {
          return isAsc ? 1 : -1
        } else if (b.transferCount > a.transferCount) {
          return isAsc ? -1 : 1
        } else {
          return 0
        }
      });
    } else if (type === 'power') {
      sortedItems.sort((a, b) => {
        if(a.power === undefined) {
          a.power = 0
        }
        if(b.power === undefined) {
          b.power = 0
        }
        if(a.power > b.power) {
          return isAsc ? 1 : -1
        } else if (b.power > a.power) {
          return isAsc ? -1 : 1
        } else {
          return 0
        }
      });
    }
    setItems(sortedItems)
     // } else if (sortVariable === 'transactions') {
    // } else if (sortVariable === 'country') {
    //   sortedItems = sortedItems.sort((a, b) => {
    //     if (a.country.toLowerCase() === b.country.toLowerCase()) {
    //       return 0;
    //     }
    //     return direction === 'asc'
    //       ? a.country.toLowerCase() > b.country.toLowerCase()
    //         ? -1
    //         : 1
    //       : b.country.toLowerCase() > a.country.toLowerCase()
    //       ? -1
    //       : 1;
    //   });
    
    
    // } else if (sortVariable === 'power') {
    // }

    // setItems(sortedItems);

    // const order = sortOrder === 'asc' ? true : false
    // let sortedItems = items
    // if(sortVariable === 'date') {
    //   console.log('before', sortedItems)
    //   sortedItems = sortedItems.sort((a, b) => {
    //     return a.id > b.id ? true : false
    //     // if(new Date(a.start_date).getTime() > new Date(b.start_date).getTime()) {
    //     //   return order
    //     // } else {
    //     //   return !order
    //     // }
    //   })
    //   console.log('after', sortedItems)
    // } else if (sortVariable === 'holders') {
    //   console.log('before', sortedItems)
    //   sortedItems = sortedItems.sort((a, b) => {
    //     if( a.tokenCount > b.tokenCount ) {
    //       return order
    //     } else {
    //       return !order
    //     }
    //   })
    //   console.log('after', sortedItems)
    // } else if (sortVariable === 'transactions') {
    // } else if (sortVariable === 'country') {
    //   sortedItems = sortedItems.sort((a, b) => {
    //     if( a.country > b.country ) {
    //       return order
    //     } else {
    //       return !order
    //     }
    //   })
    // } else if (sortVariable === 'power') {
    // }
    // setItems(sortedItems)
  };

  useEffect(() => {
      console.log(isLoaded)
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
      console.log('dataa',data)
      let oldItems = JSON.parse(localStorage.getItem('graph_events')) || []
      if(data && data.poapEvents) {
        localStorage.setItem('graph_events', JSON.stringify(data.poapEvents))
      }

      if(oldItems.length !== data.poapEvents) {
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
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{ padding: '1rem' }}>
        {/* <div className="feed" style={{display: "flex", flexDirection : "column" , justifyContent: "space-between"}}> 
        <h5> "timestamp" The Medalla Launch POAP has been transfered from 0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c to 0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c</h5>  
          <div style={{display: "flex" , justifyContent: "center"}}> <Link to="/activity">Activity view</Link> </div>

        </div>  */}

        <div className="gallery-grid">
          <div className="gallery-search">
            <input onChange={handleSearch} type="text" placeholder="Search.." />{' '}
            <span
              style={{
                position: 'absolute',
                top: '108%',
                right: '0',
                color: '#66666688',
                fontSize: '.8rem',
              }}
            >
              {search.length} result(s)
            </span>
          </div>
          <div className="gallery-filter">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginRight: '-.3rem',
              }}
              className="gallery-sort"
            >
              <span
                style={{
                  padding: '.2rem',
                  flex: '1 1 60px',
                  textAlign: 'right',
                  marginRight: '1rem',
                }}
              >
                Sort by{' '}
              </span>
              <div style={{ flex: '2 1 160px' }} className="sort-options">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                  className="selection-group"
                >
                  <div
                    style={{
                      margin: '.5rem .3rem',
                      flex: '5 5 calc(50% - 1rem)',
                      minWidth: '9rem',
                    }}
                    className="selection-item"
                  >
                    <div
                      style={{
                        width: 'inherit',
                      }}
                      className="gallery-select-container"
                      role="menu"
                    >
                      <select onChange={filterType} value={sortVariable} name="sort-by" id="" className="select">
                        <option value="date">Date</option>
                        <option value="id">Release</option>
                        <option value="holders">Holders</option>
                        <option value="transfers">Transactions</option>
                        <option value="city">City (A-Z)</option>
                        <option value="power">Poap Power</option>
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      margin: '.5rem .3rem',
                      flex: '5 5 calc(50% - 1rem)',
                      minWidth: '9rem',
                    }}
                    className="selection-item"
                  >
                    <div
                      style={{
                        width: 'inherit',
                      }}
                      className="gallery-select-container"
                      role="menu"
                    >
                      <select style={{ padding: '0 1rem' }} onChange={filterDirection} value={sortOrder} name="sort-by" id="" className="select">
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error ? (
            <div
              style={{
                gridColumn: '1 / 3',
              }}
            >
              <span>Could not load gallery, check your connection and try again</span>
            </div>
          ) : isLoaded ? (
            <Cards events={search && search.length ? search : items} length={length} />
          ) : (
            <div className="spinner">
              <div className="cube1"></div>
              <div className="cube2"></div>
            </div>
          )}
        </div>
        <InView
          threshold={1}
          onChange={(inView, entry) => {
            if (inView && items && items.length) {
              if (length + 20 < items.length) {
                setLength(length + 20);
              } else {
                setLength(items.length);
              }
            }
          }}
        >
          {({ inView, ref, entry }) => <div ref={ref}></div>}
        </InView>
      </div>
    </main>
  );
}

function Cards({ events, length }) {
  let cards = [];
  if (events && events.length && length <= events.length) {
    for (let i = 0; i < length; i++) {
      cards.push(<TokenCard key={i} event={events[i]} />);
    }
  }
  return cards;
}

function TokenCard({ event }) {
  return (
    <Link to={'/token/' + event.id} className="gallery-card">
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '75px',
          height: '75px',
          overflow: 'hidden',
          borderRadius: '50%',
        }}
      >
        <img
          style={{
            width: 'auto',
            height: '100%%',
            borderRadius: '50%',
          }}
          src={event.image_url}
          alt="POAP"
        />
      </div>
      <div
        style={{
          overflow: 'auto',
          width: '100%',
        }}
      >
        <h3
          title={event.name}
          className="h4"
          style={{
            fontSize: '1rem',
            textAlign: 'center',
            margin: '.8rem 0',
            overflowWrap: 'anywhere',
          }}
        >
          {event.name}
        </h3>
      </div>
      <div>
        <div style={{ marginTop: '5px' }}>
          {event.city ? <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faGlobe} /> : null}
          {event.city ? ' ' + event.city.length > 15 ? event.city.substr(0, 15) + '…' : event.city : (
            <div>
              {' '}
              <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faLaptop} /> virtual event{' '}
            </div>
          )}{' '}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCalendar} /> {event.start_date}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCoins} />{' '}
          {event.tokenCount ? event.tokenCount + ' supply ' : ' None Claimed'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faFire} />{' '}
          {event.power ? event.power +' power ' : '0 power'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faPaperPlane} />{' '}
          {event.transferCount ? event.transferCount + ' transfers' : '0' +' transfers '}
        </div>
      </div>
    </Link>
  );
}
