import React from 'react'
import Lottie from 'react-lottie-player'
import loadingAnimation from '../assets/animations/loading_animation.json'

export default function () {
  return (
    <Lottie
      loop
      animationData={loadingAnimation}
      play
      className='spinner'
      style={{ width: 150, height: 150 }}
    />
  )
}