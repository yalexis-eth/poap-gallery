import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import ReactTooltip from 'react-tooltip';

export function Pill({text = null, tooltip = false, icon = null, className = ''}) {
  return (
    <>
      <div className={`pill ${className}`} data-tip={tooltip ? text : null}>
        {icon && <FontAwesomeIcon style={{ width: '1rem', marginRight: '.2rem' }} icon={icon} />}
        {text}
      </div>
      {tooltip && text && <ReactTooltip effect='solid' />}
    </>
  )
}