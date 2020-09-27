import React, { useState, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlasses } from '@fortawesome/free-solid-svg-icons'

export default function Gallery() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(true)
  let events = []
  // try {
  //   events = JSON.parse(localStorage.getItem('poap_events'))
  // } catch(e) {}

  // if(events && events.length === 0) {
  //   setIsLoaded(false)
  // }

  const [items, setItems] = useState(events)
  const [search, setSearch] = useState([])
  const [length, setLength] = useState(50)
  // false is descending true is ascending
  const [sortOrder, setSortOrder] = useState(false)
  const [sortVariable, setSortVariable] = useState('date')

  const handleSearch = (event) => {
    const value = event.target.value
    if (value && value.length) {
      const filteredItems = items.filter((item) => {
        return item.name.slice(0, value.length).toLowerCase() === value.toLowerCase()
      })
      setSearch(filteredItems)
    } else {
      setSearch([])
    }
  }

  const handleFilter = () => {
    const sortedItems = items.sort((a, b) => {
      if(new Date(a.start_date).getTime() >  new Date(b.start_date).getTime()) {
        return sortOrder
      } else {
        return !sortOrder
      }
    })
    setItems(sortedItems)
  }

  useEffect(() => {
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setItems(result)
          // localStorage.setItem('poap_events', JSON.stringify(result))
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{padding: '1rem' }}> 
        <div>
          {' '}
          link to activity view: <Link to="/activity">Activity link</Link>
        </div>  

        <div className="feed"> <h5> timestamp" The Medalla Launch POAP has been transfered from 0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c to 0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c at </h5> </div> 

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
              }}>  
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
                      <select name="sort-by" id="" className="select">
                        <option value="date">Release</option>
                        <option value="holders">Holders</option>
                        <option value="transactions">Transactions</option>
                        <option value="country">Country (A-Z)</option>
                        <option value="poapPower">Poap Power</option>

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
                      <select style={{ padding: '0 1rem' }} name="sort-by" id="" className="select">
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
            <div style={{
              gridColumn: '1 / 3'
            }}>
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
                setLength(length + 20)
              } else {
                setLength(items.length)
              }
            }
          }}
        >
          {({ inView, ref, entry }) => <div ref={ref}></div>}
        </InView>
      </div>
    </main>
  )
}

function Cards({ events, length }) {
  let cards = []
  if (events && events.length && length <= events.length) {
    for (let i = 0; i < length; i++) {
      cards.push(<TokenCard key={i} event={events[i]} />)
    }
  } else {
    for (let i = 0; i < events.length; i++) {
      cards.push(<TokenCard key={i} event={events[i]} />)
    }
  }
  return cards
}

function TokenCard({ event }) {
  return (
    <Link to={"/token/" + event.id} className="gallery-card">
      <div className="place"></div>
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '75px',
          height: '75px',
        }}
      >
        <img
          style={{
            width: 'auto',
            height: '100%',
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
      
        <p>{event.city ||  <p> <FontAwesomeIcon icon={faGlasses} data-tip="This is a virtual event" /> <ReactTooltip /> </p>} </p>
        <p>{event.start_date}</p>
        <p>Circulating supply X</p>
      </div>
    </Link>
  )
}
