import React from 'react';
import { Link } from 'gatsby';
import _ from 'lodash';

import Helmet from "react-helmet";

import Layout from '../components/layout'

const Container = ({ children }) => (
  <main id="main" className="main">
    {children}
  </main>
)

const Header = ({ title, tag = null }) => (
  <header className="header-container">
    <div className={`${tag ? "list-header" : ""} header`}>
      <div className="header-info">
        <h1 className="title">
          {tag &&
            <span className="taxonomy-type">
              {title === 'Tags' ? 'Tag' : 'Category' }:&nbsp;
            </span>
          }
          {tag ? tag : title}
        </h1>
      </div>
    </div>
  </header>
)

const TermCloudContainer = ({ tags, slugPrefix }) => {
  // Calculate font-size to use
  // Ref: https://github.com/MunifTanjim/minimo/blob/master/layouts/partials/extras/term_cloud.html
  const maxSize = 2.0, minSize = 1.0;
  const sizeSpread = maxSize - minSize;

  let maxCount = -Infinity, minCount = Infinity;
  Object.keys(tags).forEach((tag) => {
    if (tags[tag].posts.length > maxCount) maxCount = tags[tag].posts.length;
    if (tags[tag].posts.length < minCount) minCount = tags[tag].posts.length;
  })
  const countSpread = maxCount - minCount;
  let sizeStep = 0;
  if (countSpread > 0) sizeStep = sizeSpread / countSpread;

  return (
    <div className="term-cloud-container">
      <ul className="term-cloud">
        {_.shuffle(Object.keys(tags)).map(tag => {
          const size = minSize + (sizeStep * (tags[tag].posts.length - minCount))
          return (
            <li key={tags[tag].slug}>
              <Link to={`${slugPrefix}/${tags[tag].slug}`} style={{ fontSize: `${size}em` }}>
                {tag}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

const ListContainer = ({ children }) => (
  <div className="list-container">
    <ul className="list">
      {children}
    </ul>
  </div>
)

export default function Tags({ pageContext, location }) {
  const { tags, posts, tag, slugPrefix, title } = pageContext;
  if (tag) {
    return (
      <Layout location={location}>
        <Container>
          <Helmet>
            <title>{title === 'Tags' ? 'Tag' : 'Category' }: {tag}</title>
          </Helmet>
          <Header title={title} tag={tag} />
          <ListContainer>
            {posts.map(({ id, frontmatter, fields }) => (
              <li className="list-item" key={id}>
                <article>
                  <div className="meta">
                    <span>
                    <span className="screen-reader">Posted in</span>
                    <time dateTime={frontmatter.dateTime}>{frontmatter.date}</time>
                    </span>
                  </div>
                  <header className="list-item-header">
                    <h3 className="list-item-title">
                      <Link to={fields.slug}>
                        {frontmatter.title}
                      </Link>
                    </h3>
                  </header>
                </article>
              </li>
            ))}
          </ListContainer>
          <nav className="entry-nav-container">
            <div className="entry-nav">
              <div className="prev-entry">
                <Link to={title === 'Tags' ? '/tags' : '/categories' }>
                  <span>
                    <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <line x1="20" y1="12" x2="4" y2="12"></line>
                      <polyline points="10 18 4 12 10 6"></polyline>
                    </svg>
                    &nbsp;Back to {title === 'Tags' ? 'Tags' : 'Categories' }
                  </span>
                </Link>
              </div>
            </div>
          </nav>
        </Container>
      </Layout>
    );
  }
  return (
    <Container>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Header title={title} />
      <TermCloudContainer tags={tags} slugPrefix={slugPrefix} />
    </Container>
  );
}
