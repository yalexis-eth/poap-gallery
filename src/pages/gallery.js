import React, {useEffect, useState} from 'react';
import {InView} from 'react-intersection-observer';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendar, faCoins, faFire, faGlobe, faLaptop, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import ActivityTable from '../components/activityTable'
import {Helmet} from 'react-helmet';
import {fetchIndexData, selectEventError, selectEventStatus, selectRecentEvents} from '../store';
import {useDispatch, useSelector} from 'react-redux';


export default function Gallery() {
  const dispatch = useDispatch()

  // Meanwhile get all the events
  useEffect(() => {
    dispatch(fetchIndexData());
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  const events  = useSelector(selectRecentEvents)
  const eventStatus = useSelector(selectEventStatus)
  const eventError = useSelector(selectEventError)


  const [items, setItems] = useState(events)
  const [search, setSearch] = useState([]);
  const [length, setLength] = useState(50);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortVariable, setSortVariable] = useState('date');


  useEffect(() => {
    setItems(events)
  }, [events])



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
        a.start_date = a.start_date.replace(/-/g, " ")
        b.start_date = b.start_date.replace(/-/g, " ")
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
  };

  return (
    <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Home</title>
        <link rel="canonical" href="https://poap.gallery"/>
        <meta property="og:url" content="https://poap.gallery"></meta>
        <meta property="og:title" content="POAP Gallery - Home"></meta>
      </Helmet>
      <div className="container" style={{ padding: '1rem' }}>
        <ActivityTable />
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
          {eventError ? (
            <div
              style={{
                gridColumn: '1 / 3',
              }}
            >
              <span>Could not load gallery, check your connection and try again</span>
            </div>

          ) : eventStatus === 'succeeded' ? (
            <Cards events={search && search.length ? search : items} length={search.length || length} />
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
  } else if(events && events.length) {
    for (let i = 0; i < events.length; i++) {
      cards.push(<TokenCard key={i} event={events[i]} />)
    }
  }
  return cards;
}

function TokenCard({ event }) {
  return (
    <Link to={'/event/' + event.id} className="gallery-card">
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
          {event.transferCount ? event.transferCount + ' transfers' : '0 transfers '}
        </div>
      </div>
    </Link>
  );
}
