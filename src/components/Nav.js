import React from 'react';
import { Link } from 'gatsby';

export default () => (
  <nav id="main-menu" className="main-menu-container" aria-label="Main Menu">
    <ul className="main-menu">
      <li>
        <Link activeClassName="current" to="/">
          Home
        </Link>
      </li>
      <li>
        <Link activeClassName="current" to="/blog">
          Blog
        </Link>
      </li>
      <li>
        <Link activeClassName="current" to="/about">
          About
        </Link>
      </li>
      <li>
        <a href="https://github.com/alvinthen/yaobin.me" target="_blank">Repo</a>
      </li>
    </ul>
  </nav>
);
