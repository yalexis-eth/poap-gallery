import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faCoins, faGlobe, faHashtag, faLaptop, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function EventCard({ event, showHeading }) {
  return (
    <Link to={'/event/' + event.id} className="gallery-card">
      {showHeading && <div>
        <h4>{event.heading}</h4>
      </div>}
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
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover'
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
          <div style={{ marginBottom: '5px' }}>
            <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faHashtag} />
            {event.id}
          </div>
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
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faPaperPlane} />{' '}
          {event.transferCount ? event.transferCount + ' transfers' : '0 transfers '}
        </div>
      </div>
    </Link>
  );
}
