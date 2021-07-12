import React from 'react'
import ReactTooltip from 'react-tooltip';

export function Pill({text = '', tooltip = false, className = ''}) {
  return (
    <>
      <div className={`pill ${className}`} data-tip={text}>{text}</div>
      {tooltip ? <ReactTooltip /> : null}
    </>
  )
}