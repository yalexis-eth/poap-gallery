import React from 'react'
import BuiltOnEth from '../assets/images/built-on-eth.png'
import POAPLogo from '../assets/images/POAP.svg'
import TwitterLogo from '../assets/images/logo-twitter-grey.svg'
import GithubLogo from '../assets/images/logo-github-grey.svg'
import TelegramLogo from '../assets/images/logo-telegram-grey.svg'
import DiscordLogo from '../assets/images/logo-discord-grey.svg'
import RedditLogo from '../assets/images/logo-reddit-grey.svg'

export default function () {
  return (
    <div style={{marginTop: 100}}>
    <hr className='footer-divider' />
    <footer className={`footer footer-grid`}>
      {/* FIX: 'a' elements generate a js error when hovered */}
      <a href="/" className="home-link"><img src={POAPLogo} alt="" /></a>
      <div className="ecosystem">
        <h4>POAP Ecosystem</h4>
        <a href="https://www.poap.xyz/" className="a" target="_blank"  rel="noopener noreferrer">poap.xyz</a>
        <a href="https://poap.fun/" className="b" target="_blank"  rel="noopener noreferrer">poap.fun</a>
        <a href="https://poap.chat/" className="c" target="_blank"  rel="noopener noreferrer">poap.chat</a>
        <a href="https://www.poap.gallery/" className="d" target="_blank"  rel="noopener noreferrer">poap.gallery</a>
        <a href="https://www.poap.delivery/" className="e" target="_blank"  rel="noopener noreferrer">poap.delivery</a>
        <a href="https://app.poap.xyz/" className="f" target="_blank"  rel="noopener noreferrer">poap.app</a>
        <a href="https://poap.vote/" className="g" target="_blank"  rel="noopener noreferrer">poap.vote</a>
        <a href="https://app.poap.art/" className="h" target="_blank"  rel="noopener noreferrer">poap.art</a>
      </div>
      <div className="join-links">
        <h4>Join our community!</h4>
        <div className="social-icons">
          <a href="https://twitter.com/poapxyz/" target="_blank"  rel="noopener noreferrer"><img src={TwitterLogo} alt="Twitter" /></a>
          <a href="https://github.com/poapxyz/poap" target="_blank"  rel="noopener noreferrer"><img src={GithubLogo} alt="Github" /></a>
          <a href="https://t.me/poapxyz" target="_blank"  rel="noopener noreferrer"><img src={TelegramLogo} alt="Telegram" /></a>
          <a href="https://discord.gg/fcxW4yR" target="_blank"  rel="noopener noreferrer"><img src={DiscordLogo} alt="Discord" /></a>
          <a href="https://reddit.com/r/poap" target="_blank"  rel="noopener noreferrer"><img src={RedditLogo} alt="Reddit" /></a>
        </div>
      </div>
      <div className="eth-branding">
        <img src={BuiltOnEth} alt="Built on Ethereum" />
      </div>
    </footer>
    </div>
    );
}
