import React, {useCallback, useEffect, useState} from 'react';
import ActivityTable from '../components/activityTable'
import {Helmet} from 'react-helmet';
import {fetchIndexData, selectEventError, selectEventStatus, selectRecentEvents} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import {EventCard} from "../components/eventCard";
import Loader from '../components/loader'
import { debounce } from '../utilities/utilities';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import FailedSearch from '../assets/images/failed-search.svg'

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
  const [search, setSearch] = useState(undefined);
  const [length, setLength] = useState(50);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortVariable, setSortVariable] = useState('date');

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setItems(events)
  }, [events])

  const debounceHandleSearch = useCallback(debounce((nextValue, items) => handleNewSearchValue(nextValue, items), 800), [])
  const handleSearch = (event) => {
    const value = event.target.value
    setSearchValue(value);
    debounceHandleSearch(value, items)
  };
  const handleNewSearchValue = (value, items) => {
    if (value && value.length > 1) {
      const filteredItems = items.filter((item) => {
        return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
      setSearch(filteredItems);
    } else {
      setSearch(undefined);
    }
  }

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
        const a_start_date = a.start_date.replace(/-/g, " ")
        const b_start_date = b.start_date.replace(/-/g, " ")
        return isAsc
          ? new Date(a_start_date).getTime() - new Date(b_start_date).getTime()
          : new Date(b_start_date).getTime() - new Date(a_start_date).getTime();
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
    }
    setItems(sortedItems)
  };

  const eraseSearch = () => {
    setSearchValue('');
    debounceHandleSearch('', items)
  }

  return (
    <main id="site-main" role="main" className="app-content home-main">
      <Helmet>
        <title>POAP Gallery - Home</title>
        <link rel="canonical" href="https://poap.gallery"/>
        <meta property="og:url" content="https://poap.gallery"></meta>
        <meta property="og:title" content="POAP Gallery - Home"></meta>
      </Helmet>
      <div className="container">
        <div className="gradient-background"></div>
        <div className='background'></div>
        <div className='content'>
          <ActivityTable />
          <div className="gallery-title">Explore</div>
          <hr />
          <div className="gallery-grid">
            <div className="gallery-search">
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                <input onChange={handleSearch} type="text" value={searchValue} placeholder="Search.." maxLength={20} />{' '}
                <FontAwesomeIcon icon={faTimesCircle} onClick={eraseSearch} style={{ position: 'relative', fontSize: '1.5rem', right: 37, top: 13, cursor: 'pointer', color: '#C4CAE8' }} />
              </div>
              {
                search && search.length ?
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
                </span> : null
              }
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
                    color: '#8492CE'
                  }}
                >
                  Order by{' '}
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
                          <option value="id">ID</option>
                          <option value="holders">Holders</option>
                          <option value="transfers">Transactions</option>
                          <option value="city">City (A-Z)</option>
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
              (search?.length === 0) ? <div className='failed-search'>
                <img src={FailedSearch} alt='Failed search'/>
                <h3>No results for that search :(</h3>
              </div> :
              <Cards events={(search?.length) ? search : items} length={search?.length || length} />
            ) : (
              <Loader></Loader>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
          {!search ?
            <button style={{maxWidth: 1120, margin: '0 auto', marginTop: '40px'}} className='btn' onClick={() => {
                if (items && items.length) {
                  if (length + 20 < items.length) {
                    setLength(length + 20);
                  } else {
                    setLength(items.length);
                  }
                }
              }}>
              Load more
            </button> : null
          }
        </div>
      </div>
    </main>
  );
}

function Cards({ events, length }) {
  let cards = [];
  if (events && events.length) {
    let len = (length <= events.length) ? length : events.length;
    for (let i = 0; i < len; i++) {
      cards.push(<EventCard key={i} event={events[i]} />)
    }
  }
  return cards;
}
