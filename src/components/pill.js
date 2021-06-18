import React from 'react'
import ReactTooltip from 'react-tooltip';

export function Pill({text = '', tooltip = false}) {
  return (
    <>
      <div className='pill' data-tip={text}>{text}</div>
      {tooltip ? <ReactTooltip place='right' effect='solid' type='success' /> : null}
    </>
  )
}