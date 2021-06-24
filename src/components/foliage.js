import React, { useEffect, useState } from "react";
import PlantPink from '../assets/images/plant-pink.svg'
import PlantBlue from '../assets/images/plant-blue.svg'
import MiscLeft from '../assets/images/miscelaneous-left.svg'
import MiscRight from '../assets/images/miscelaneous-right.svg'

export function Foliage() {
  const [height, setHeight] = useState(document.body.clientHeight)
  useEffect(() => {
    setInterval(() => {
      setHeight(document.documentElement.scrollHeight);
    }, 1000);
  }, [])

  return (
    <div style={{position: 'relative', zIndex: -1}}>
      <img src={MiscLeft} alt='misc items' style={{position: 'absolute', left: '0', top: '407px'}}/>
      <img src={MiscRight} alt='misc items' style={{position: 'absolute', right: '0', top: '454px'}}/>
      {
        (height>(845+70+253+500))?
        <img src={PlantBlue} alt='blue plant' style={{position: 'absolute', left: '0', top: '845px'}}/>
        : null
      }
      {
        (height>(1311+70+253+500))?
        <img src={PlantPink} alt='pink plant' style={{position: 'absolute', right: '0', top: '1311px'}}/>
        : null
      }
    </div>
  );
}
