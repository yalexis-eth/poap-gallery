import React, { useState, useEffect, useRef } from 'react'
import ReactModal from 'react-modal';
import { Formik, FormikActions, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { SubmitButton } from '../components/submitButton';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';

ReactModal.setAppElement('#root');

const handleFormSubmit = async (
  values,
  actions
) => {
  console.log('form submitted')
  // if (!selectedFilter) return;
  // try {
  //   actions.setStatus(null);
  //   actions.setSubmitting(true);

  //   const gasPriceInWEI = convertFromGWEI(values.gasPrice);
  //   await setSigner(selectedFilter.id, gasPriceInWEI);
  //   fetchSigners();
  //   closeEditModal();
  // } catch (error) {
  //   actions.setStatus({ ok: false, msg: `Gas price couldn't be changed` });
  // } finally {
  //   actions.setSubmitting(false);
  // }
};




export default function Gallery() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(true);
  const [offset, setOffset] = useState(0)
  const [length, setLength] = useState(20)

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value
    if(value && value.length) {
      const filteredItems = items.filter(item => {
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
    fetch("https://api.poap.xyz/events")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  return (
    <main id="site-main" role="main" className="app-content">
     <div className="container" style={{padding: '1rem'}}>
      <div className="gallery-grid" style={{
        //_poapapp.scss media 
      }}>
      <div className="gallery-search">
    <input onChange={handleSearch} type="text" placeholder="Search.."/> <span style={{
      position: 'absolute',
      top: '85%',
      right: '0',
      color: '#66666688',
      fontSize: '.8rem',
    }}>{search.length} result(s)</span>
      </div>
      <div className="gallery-filter">
        <a onClick={() => openModal()} className="btn" >
          <span>Filter</span>
        </a>
      </div>
        <Cards events={search && search.length ? search : items} length={length} offset={offset}/>
      </div>
      <InView
      threshold={1}
      onChange={(inView, entry) => {
         if(inView && items && items.length) {
           if((length + 20) < items.length) {
             setLength(length + 20)
           } else {
             setLength(items.length)
           }
         }
      }}
      >
      {({ inView, ref, entry }) => (
        <div ref={ref}>
        </div>
      )}
      </InView>
    </div>
    <ReactModal
        isOpen={modalOpen}
        // shouldFocusAfterRender={true}

      >
        <div>
          <h3>Set Filter</h3>
          {selectedFilter &&
            <Formik
              enableReinitialize
              onSubmit={handleFormSubmit}
              initialValues={{ gasPrice: 1 }}
              // validationSchema={}
            >
              {({ dirty, isValid, isSubmitting, status, touched }) => {
                return (
                  <Form className="price-gas-modal-form">
                    <Field
                      name="gasPrice"
                      render={({ field, form }) => {
                        return (
                          <input
                            type="text"
                            autoComplete="off"
                            className={classNames(!!form.errors[field.name] && 'error')} 
                            placeholder={'Gas price in GWEI'}
                            {...field}
                          />
                        );
                      }}
                    />
                    <ErrorMessage name="gasPrice" component="p" className="bk-error"/>
                    {status && (
                      <p className={status.ok ? 'bk-msg-ok' : 'bk-msg-error'}>{status.msg}</p>
                    )}
                    <SubmitButton
                      text="Modify gas price"
                      isSubmitting={isSubmitting}
                      canSubmit={isValid && dirty}
                    />
                    <div onClick={closeModal} className={'close-modal'}>
                      Cancel
                    </div>
                  </Form>
                );
              }}
            </Formik>
          }
        </div>
      </ReactModal>
  </main>
  )
}


function Cards({ events, offset, length }) {
  let cards = []
  if (events && events.length && length <= events.length) {
    for (let i = offset; i < length; i++) {
      cards.push(<TokenCard key={i} event={events[i]}/>)
    }
  } else {
    for (let i = 0; i < events.length; i++) {
      cards.push(<TokenCard key={i} event={events[i]}/>)
    }
  }
  return cards
}


function TokenCard({ event }) {
  return (
      <div className="gallery-card">
        <div style={{
          // border: 'black solid 1px',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
        }}>
          <img style={{
            width: 'auto',
            height: '100%',
            borderRadius: '50%',
          }} src={event.image_url} alt="POAP" />
        </div>
        <div style={{
          overflow: 'auto',
          width: '100%',
          }}>
        <h3 title={event.name} className="h4"
        style={{
          fontSize: '1rem',
          textAlign: 'center',
          margin: '.8rem 0',
        }}
        >{event.name}</h3>
        </div>
        <div>
        <p>{event.city || "virtual"}</p>
        <p>{event.start_date}</p>
          <p>Circulating supply X</p>
        </div>
      </div>
  )
}

