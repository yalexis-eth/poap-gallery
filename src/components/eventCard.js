import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCoins, faGlobe, faHashtag, faLaptop, faPaperPlane, faClock, faFire } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function EventCard({ event, size = 's', type = ''}) {
  const validateType = (type) => {
    if (size !== 'm') return '';
    if (type !== 'most-recent' && type !== 'upcoming' && type !== 'most-claimed') return '';
    return type;
  }
  type = validateType(type);
  
  const Header = () => (
    <div className={`header ${type}`}>
      <img
        src={event.image_url}
        alt="POAP" />
    </div>
  );
  const Content = () => (
    <div className="content">
      <div
        className="content-first"
        style={{
          overflow: 'hidden',
          width: '100%',
          padding: '1rem'
        }}>

        {/* tipo de evento */}
        <div className={`${type === '' ? 'hidden' : 'pill event-type'} ${type}`}>
          {
            type === 'most-recent' ? <div><FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faClock} />Most recent</div> :
            type === 'upcoming' ? <div><FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCalendar} />Upcoming</div> :
            type === 'most-claimed' ? <div><FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faFire} />Most claimed</div> :
            ''
          }
        </div>

        {/* titulo */}
        <h3
          title={event.name}
          className="h4"
          style={{
            fontSize: '1rem',
            textAlign: 'center',
            margin: '8px 0 0 0',
            overflowWrap: 'anywhere',
          }}>
          {event.name}
        </h3>
        
        {/* id */}
        <div className="content-id">
          <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faHashtag} />
          {event.id}
        </div>

        {/* fecha y lugar */}
        <div className="content-time-place">
          <div className="pill">
            <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faCalendar} /> {event.start_date}
          </div>
          <div className="pill">
            {event.city ? <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faGlobe} /> : null}
            {event.city ? ' ' + event.city.length > 15 ? event.city.substr(0, 15) + '…' : event.city : (
              <div>
                {' '}
                <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={faLaptop} /> Virtual event{' '}
              </div>
            )}{' '}
          </div>
        </div>
      </div>
      
      <hr />

      <div
        className="content-second"
        style={{
          overflow: 'hidden',
          width: '100%',
          padding: '1rem'
        }}>
        {/* supply y transfers */}
        <div>
          <div className="title">
            <FontAwesomeIcon style={{ width: '1rem', marginRight: '.4rem' }} icon={faCoins} />{'SUPPLY'}
          </div>
          {event.tokenCount ? event.tokenCount : ' None Claimed'}
        </div>
        <div>
          <div className="title">
            <FontAwesomeIcon style={{ width: '1rem', marginRight: '.4rem' }} icon={faPaperPlane} />{'TRANSFERS'}
          </div>
          {event.transferCount ? event.transferCount : 0}
        </div>
      </div>
    </div>
  )

  return (
    <Link to={'/event/' + event.id} className={`
      gallery-card
      ${(size === 'l') ? 'large' : (size === 'm') ? 'medium' : 'small'}`}>
      <Header url={event.image_url} />
      <Content />
    </Link>
  );
}
