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
        <a href="https://www.poap.xyz/" className="a">poap.xyz</a>
        <a href="https://poap.fun/" className="b">poap.fun</a>
        <a href="https://poap.chat/" className="c">poap.chat</a>
        <a href="https://www.poap.gallery/" className="d">poap.gallery</a>
        <a href="https://www.poap.delivery/" className="e">poap.delivery</a>
        <a href="https://app.poap.xyz/" className="f">poap.app</a>
        <a href="https://poap.vote/" className="g">poap.vote</a>
        <a href="https://app.poap.art/" className="h">poap.art</a>
      </div>
      <div className="join-links">
        <h4>Join our community!</h4>
        <div className="social-icons">
          <a href="https://twitter.com/poapxyz/"><img src={TwitterLogo} alt="Twitter" /></a>
          <a href="https://github.com/poapxyz/poap"><img src={GithubLogo} alt="Github" /></a>
          <a href="https://t.me/poapxyz"><img src={TelegramLogo} alt="Telegram" /></a>
          <a href="https://discord.gg/fcxW4yR"><img src={DiscordLogo} alt="Discord" /></a>
          <a href="https://reddit.com/r/poap"><img src={RedditLogo} alt="Reddit" /></a>
        </div>
      </div>
      <div className="eth-branding">
        <img src={BuiltOnEth} alt="Built on Ethereum" />
      </div>
    </footer>
    </div>
    );
}
