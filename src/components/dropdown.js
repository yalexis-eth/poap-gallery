import React, { useState } from 'react';


export default function Dropdown({title, options, defaultOption, onClickOption}) {
  
  const [_title, setTitle] = useState(title)
  const [displayMenu, setDisplayMenu] = useState(false)

  const toggleDisplayMenu = () => {
    setDisplayMenu(!displayMenu)
  }

  let optionsElements = []
  for(let i = 0; i < options.length; i++) {
    optionsElements.push(
      <div className={`option ${options[i] === defaultOption?'active':''}`} onClick={() => {
        setTitle(options[i])
        toggleDisplayMenu()
        onClickOption(options[i])
      }}>{options[i]}</div>
    )
  }

  return (
    <div className="select" style={{}}
      onMouseLeave={() => setDisplayMenu(false)}
      >
      <div className="select-button"
        onClick={toggleDisplayMenu}
        onMouseEnter={() => setDisplayMenu(true)}
        > {_title} </div>

      {
        displayMenu ? (
        <div className='select-options'
          onMouseLeave={() => setDisplayMenu(false)}
          >
          {optionsElements}
        </div>)
        : null
      }

    </div>

  );
}
