import React, { useState, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'


export default function Gallery() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [items, setItems] = useState([])
  const [search, setSearch] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState(true)
  const [offset, setOffset] = useState(0)
  const [length, setLength] = useState(50)

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSearch = (event) => {
    const value = event.target.value
    if (value && value.length) {
      const filteredItems = items.filter((item) => {
        return item.name.slice(0, value.length).toLowerCase() === value.toLowerCase()
      })
      setSearch(filteredItems)
      console.log('search results', search)
    } else {
      console.log('deleting search')
      setSearch([])
    }
  }

  useEffect(() => {
    fetch('https://api.poap.xyz/events')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setItems(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container" style={{ padding: '1rem' }}>
        <div> link to activity <Link to="/activity">Activity link</Link></div>
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
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginRight: '-.3rem'
                }} className="gallery-sort">
              <span  style={{
                padding: '.2rem',
                flex: '1 1 60px',
                textAlign: 'right',
                marginRight: '1rem',
                }}>Sort by </span>
              <div style={{ flex: '2 1 160px'}} className="sort-options">
                <div style={{
                  display: 'flex', 
                  flexWrap: 'wrap',
                  justifyContent: 'space-between' 
                  }} className="selection-group">
                  <div 
                  style={{
                    margin: '.5rem .3rem',
                    flex: '5 5 calc(50% - 1rem)',
                    minWidth: '9rem',
                  }}
                  className="selection-item">
                    <div style={{
                     width: 'inherit'
                    }} className="gallery-select-container" role="menu">
                      <select name="sort-by" id="" className="select">
                        <option value="date">Release</option>
                        <option value="holders">Holders</option>
                        <option value="transactions">Transactions</option>
                      </select>
                    </div>
                  </div>
                  <div style={{
                    margin: '.5rem .3rem',
                    flex: '5 5 calc(50% - 1rem)',
                    minWidth: '9rem',
                  }} className="selection-item">
                  <div style={{
                    width: 'inherit'
                  }} className="gallery-select-container" role="menu">
                      <select style={{padding: '0 1rem'}} name="sort-by" id="" className="select">
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <a onClick={() => openModal()} className="btn">
              <span>Filter</span>
            </a> */}
          </div>
          {isLoaded ? (
            <Cards events={search && search.length ? search : items} length={length} offset={offset} />
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

function Cards({ events, offset, length }) {
  let cards = []
  if (events && events.length && length <= events.length) {
    for (let i = offset; i < length; i++) {
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
    <Link to="/token">
    <div className="gallery-card">
      <div className="place"></div>
      <div
        style={{
          // border: 'black solid 1px',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
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
          }}
        >
          {event.name}
        </h3>
      </div>
      <div>
        <p>{event.city || 'virtual'}</p>
        <p>{event.start_date}</p>
        <p>Circulating supply X</p>
      </div>
    </div>
    </Link>
  )
}
