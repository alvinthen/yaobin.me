import React from 'react';
import { graphql } from 'gatsby'

export default ({ siteMetadata }) => (
  <footer id="footer" className="footer-container">
    <div className="footer">
      <div className="social-menu-container">
        <nav aria-label="Social Menu">
          <ul className="social-menu">
            <li>
              <a href={`https://github.com/${siteMetadata.github}`} target="_blank" rel="noopener">
                <span className="screen-reader">Open Github account in new tab</span><svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href={`https://facebook.com/${siteMetadata.facebook}`} target="_blank" rel="noopener">
                <span className="screen-reader">Open Facebook account in new tab</span><svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${siteMetadata.instagram}`} target="_blank" rel="noopener">
                <span className="screen-reader">Open Instagram account in new tab</span><svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>
            </li>
            <li>
              <a href={`https://twitter.com/${siteMetadata.twitter}`} target="_blank" rel="noopener">
                <span className="screen-reader">Open Twitter account in new tab</span>
                  <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
              </a>
            </li>
            <li>
              <a href={`mailto:${siteMetadata.email}`} target="_blank" rel="noopener">
                <span className="screen-reader">Contact via Email</span><svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="copyright">
        <p>© 2018 Yaobin Then
          <br /># logo created by <a href="https://www.linkedin.com/in/ng-yi-yang-4946a710b/">Yiyang Ng</a>
          <br /># theme inspired by <a href="https://minimo.netlify.com">minimo</a>
          <br /># powered by <a href="https://www.gatsbyjs.org/">GatsbyJS</a>
        </p>
      </div>
    </div>
  </footer>
);

export const footerFragment = graphql`
  fragment Footer_siteMetadata on Site {
    siteMetadata {
      facebook
      twitter
      email
      instagram
      github
    }
  }
`;
