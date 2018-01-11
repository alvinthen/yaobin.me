import React from 'react';

import Favicon from '../components/Favicon';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default ({ data: { site: { siteMetadata } }, children, location: { pathname } }) => (
  <div className={pathname === '/' || pathname === '/blog' ? 'home' : 'page'}>
    <div className="site">
      <Favicon />
      <Header siteMetadata={siteMetadata} />
      {children()}
      <Footer siteMetadata={siteMetadata} />
    </div>
  </div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      ...Footer_siteMetadata
      ...Header_siteMetadata
    }
  }
`;
