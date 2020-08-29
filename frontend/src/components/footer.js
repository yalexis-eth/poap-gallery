import React from 'react'
import BuiltOnEth from '../assets/images/built-on-eth.png'
import FooterShadow from '../assets/images/footer-shadow.svg';
import FooterShadowDesktop from '../assets/images/footer-shadow-desktop.svg';
import FooterPattern from '../assets/images/footer-pattern.svg';

export default function () {
  return (
      <footer
        role="contentinfo"
        className={`footer-events 
        ${path === 'home' ? 'normal-background' : ''} 
        ${path === 'token' ? 'secondary-background' : ''}`}
      >
        <div className="image-footer">
          <img src={FooterShadow} className="mobile" alt="" />
          <img src={FooterShadowDesktop} className="desktop" alt="" />
        </div>
        <div className="footer-content">
          <div className="container">
            <img src={FooterPattern} alt="" className="decoration big-picture" />
            <p className="made-by">
              Made with{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g data-name="Layer 2">
                  <g data-name="heart">
                    <rect width="24" height="24" />
                    <path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21z" />
                  </g>
                </g>
              </svg>
              by
              <a
                target="_blank"
                href="https://starflinger.eu"
                rel="noopener noreferrer"
                className="made-by-link highlight-effect"
              >
                Stefan & Inan
              </a>
            </p>
            <div className="eth-branding">
              <img src={BuiltOnEth} alt="Built on Ethereum" />
            </div>
          </div>
        </div>
      </footer>
    );
}
