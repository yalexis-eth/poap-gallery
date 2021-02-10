import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useTable, usePagination } from 'react-table'
import ReactTooltip from 'react-tooltip';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faLaptop } from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventPageData, selectEventById } from '../store';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { CSVLink } from "react-csv";



export default function Events() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:eventId`}>
        <Event />
      </Route>
      <Route path={match.path}>
        <h3>No event Selected</h3>
      </Route>
    </Switch>
  );
}

export function Event() {
  const params = useParams();
  const { eventId } = params;
  const dispatch = useDispatch()

  const tokens = useSelector(state => state.events.tokens)

  const loadingEvent  = useSelector(state => state.events.eventStatus)
  const loading  = useSelector(state => state.events.status)
  const error = useSelector(state => state.events.error)
  const errorEvent = useSelector(state => state.events.eventError)
  const event = useSelector(state => selectEventById(state, eventId))
  
  const pageCount = useMemo( () => event.tokenCount % 50 != 0 ? Math.floor(event.tokenCount / 50) + 1 : event.tokenCount, [event])
  const {data, csv_data} = useMemo(() => {
    const data = []
    const csv_data = [];

		// Add the headers
    csv_data.push(['ID', 'Owner', 'Claim Date', 'Tx Count', 'Power']);
    for (let i = 0; i < tokens.length; i++) {
      data.push({
        col1:  (<a href={"https://app.poap.xyz/token/" + tokens[i].id}>{tokens[i].id}</a>) ,
        col2: (<a href={"https://app.poap.xyz/scan/" + tokens[i].currentOwner.id}> {tokens[i].ens ? tokens[i].ens : tokens[i].currentOwner.id.substr(0,10)}…{tokens[i].ens ? tokens[i].ens : tokens[i].currentOwner.id.substr(32)}</a>),
        col3: new Date(tokens[i].created * 1000).toLocaleDateString(),
        col4: tokens[i].transferCount,
        col5: tokens[i].currentOwner.tokensOwned,
      })
      csv_data.push([tokens[i].id, tokens[i].currentOwner.id, new Date(tokens[i].created * 1000).toLocaleDateString(), tokens[i].transferCount, tokens[i].currentOwner.tokensOwned])
    }
    return {data, csv_data}
  }, [tokens])

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventPageData({ eventId, first: 1000, skip: 0  }))
    }
  }, [dispatch, eventId])

  const fetchData = useCallback(({pageSize, pageIndex}) => {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        console.log('fetching data', startRow, endRow)
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Owner',
        accessor: 'col2',
      },
      {
        Header: 'Claim Date',
        accessor: 'col3',
      },
      {
        Header: 'Tx Count',
        accessor: 'col4',
      },
      {
        Header: () => (<span>Power <FontAwesomeIcon icon={faQuestionCircle} data-tip="Total amount of POAPs held by this address" /> <ReactTooltip /></span>),
        accessor: 'col5',
      },
    ],
    []
  )


  if (loading === 'loading' || loading === 'idle' || loadingEvent === 'loading' || loadingEvent === 'idle') {
    return (
      <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Event</title>
        <link rel="canonical" href={"https://poap.gallery/event/" + eventId}/>
        <meta property="og:url" content={"https://poap.gallery/event/" + eventId }></meta>
        <meta property="og:title" content="POAP Gallery - Event"></meta>
      </Helmet>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || errorEvent || Object.keys(event).length === 0) {
    return (
      <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Event</title>
        <link rel="canonical" href={"https://poap.gallery/event/" + eventId}/>
        <meta property="og:url" content={"https://poap.gallery/event/" + eventId }></meta>
        <meta property="og:title" content="POAP Gallery - Event"></meta>
      </Helmet>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '0 auto', textAlign: 'center'}}>
          <h2>{error || errorEvent || 'Token not found'}</h2>
          <div >
            <img alt="warning sign" style={{maxWidth: '30rem'}} src="/icons/warning.svg"></img>
          </div>
        </div>
      </main>
    )
  }



  return (
    <main id="site-main" role="main" className="app-content">
      <Helmet>
        <title>POAP Gallery - Event</title>
        <link rel="canonical" href={"https://poap.gallery/event/" + eventId}/>
        <meta property="og:url" content={"https://poap.gallery/event/" + eventId }></meta>
        <meta property="og:title" content="POAP Gallery - Event"></meta>
      </Helmet>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap',
          alignContent: 'space-around',
          justifyContent: 'space-around',
        }}>
          <div style={{flex: '0 0 18rem', display: 'flex', flexDirection: "column", justifyContent: "center"}}>
            <div style={{display: 'flex', justifyContent: "space-between"}}> 
              <a href={parseInt(eventId)-1} ><FontAwesomeIcon icon={faAngleLeft}> </FontAwesomeIcon> </a>
              <h4 style={{marginBottom: '0'}}> Event Id: {eventId} </h4>
              <a href={parseInt(eventId)+1} ><FontAwesomeIcon icon={faAngleRight}> </FontAwesomeIcon></a>
            </div>
            <div style={{minHeight: '200px', margin: '0 auto'}}>
              <TokenCard event={event} />
            </div>
          </div>
          <div style={{flex: '1 1 18rem', maxWidth: '500px', overflowWrap: 'anywhere'}}>
            {tokenDetails(event, csv_data)}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent:'center',textAlign: 'center'}}>
          <div style={{maxWidth: '50rem'}}>{event.description}</div> 
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', overflow: 'auto'}}>
          <CSVLink
            filename={`${event.name}.csv`}
            target="_blank"
            className="btn"
            style={{
              fontSize: '0.9rem', width: 'fit-content', borderRadius: '10px',
              boxShadow: 'none', minHeight: 'fit-content', minWidth: 'auto',
              marginBottom: '0px'
            }}
            data={csv_data}
          >
            Download CSV
          </CSVLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'auto' }}>
          <CreateTable event={event} loading={loadingEvent !== 'succeeded'} fetchData={fetchData} columns={columns} data={data} pageCount={pageCount} ></CreateTable>
        </div>
      </div>
    </main>
  );
}

function CreateTable({loading, pageCount: pc, fetchData, columns, data, event}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, pageCount: pc, initialState: { pageIndex: 0 }, manualPagination: true }, usePagination)

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  return (
    <div style={{width: '100%'}}>
      <table className="activityTable" style={{ width: '100%', border: 'none' }} {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan="10000">Loading...</td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of {page.length}{' '}
                results
              </td>
            )}
          </tr>
        </tbody>
    </table>
   </div>
  )
}

function TokenCard({ event }) {
  return (
    <div
      style={{
        borderRadius: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem 0rem',
        width: '300px',
      }}
    > 
      <div 
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden'
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
          src={event.image_url}
          alt="POAP"
        />
      </div>
      <div>
        <h3
        title={event.name}
        className="h4"
        style={{
          fontSize: '1.15rem',
          textAlign: 'center',
          margin: '.8rem 0',
          overflowWrap: 'anywhere',
        }}
        >{event.name}</h3>
      </div>
      <div></div>
    </div>
  );
}

function tokenDetails(event, csv_data) {
  let array1 = [
    { value: event.city, key: 'City' },
    { value: event.country, key: 'Country' },
    { value: event.start_date, key: 'Start date' },
    { value: event.end_date, key: 'End date' },
    { value: event.event_url, key: 'Website', render: (value) => {
      let host = new URL(value).hostname
      return (
      <a href={value} className="href">{host}</a>
      )
    } },
    // { value: event.description, key: 'Description' },
  ];
  let array2 = [];

  for (let i = 0; i < array1.length; i++) {
    if(array1[0].value === ''){
      array1[0].value = <span> Virtual event  <FontAwesomeIcon icon={faLaptop}></FontAwesomeIcon> </span>
    }
    if(array1[1].value === array1[2].value){
      //array1.shift();
      array1[1].value = null;
      array1[2] = {value: event.end_date, key: 'Date'} 
    } //todo: if 1 == 2 , it pushes the the table down
    if(array1[i].value){
      let e = (
        <div key={i} style={{ display: 'flex', padding: '0 1rem'}}>
          <h4 style={{ flex: '0 0 7rem'}}> {array1[i].key} </h4>
          <div style={{ flex: '1 1 8rem'}}> {array1[i].render ? array1[i].render(array1[i].value) : array1[i].value} </div>
        </div>
      );
      array2.push(e);
    }
  }
  return array2;
}


