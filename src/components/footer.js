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
      // <footer
      //   id="footer"
      //   role="contentinfo"
      //   className={`footer-events normal-background`}
      // >
      //   <div className="image-footer">
      //     <img src={FooterShadow} className="mobile" alt="" />
      //     <img src={FooterShadowDesktop} className="desktop" alt="" />
      //   </div>
      //   <div className="footer-content">
      //     <div className="container">
      //       <img src={FooterPattern} alt="" className="decoration big-picture" />
      //       <p className="made-by">
      //         Made with{' '}
      //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      //           <g data-name="Layer 2">
      //             <g data-name="heart">
      //               <rect width="24" height="24" />
      //               <path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21z" />
      //             </g>
      //           </g>
      //         </svg>
      //         by
      //         <a
      //           target="_blank"
      //           href="https://starflinger.eu"
      //           rel="noopener noreferrer"
      //           className="made-by-link highlight-effect"
      //         >
      //           Stefan & Inan
      //         </a>
      //       </p>
      //       <div className="eth-branding">
      //         <img src={BuiltOnEth} alt="Built on Ethereum" />
      //       </div>
      //     </div>
      //   </div>
      // </footer>
    );
}
