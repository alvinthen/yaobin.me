import React from 'react';
import Link from 'gatsby-link';
import _ from 'lodash';

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

  let maxCount = -Infinity, minCount = Infinity
  Object.keys(tags).forEach((tag) => {
    if (tags[tag].length > maxCount) maxCount = tags[tag].length
    if (tags[tag].length < minCount) minCount = tags[tag].length
  })
  const countSpread = maxCount - minCount
  let sizeStep = 0
  if (countSpread > 0) sizeStep = sizeSpread / countSpread

  return (
    <div className="term-cloud-container">
      <ul className="term-cloud">
        {_.shuffle(Object.keys(tags)).map(tag => {
          const size = minSize + (sizeStep * (tags[tag].length - minCount))
          return (
            <li key={tag}>
              <Link to={`${slugPrefix}${tag}`} style={{ fontSize: `${size}em` }}>
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

export default function Tags({ pathContext }) {
  const { tags, posts, tag, slugPrefix, title } = pathContext;
  if (tag) {
    return (
      <Container>
        <Header title={title} tag={tag} />
        <ListContainer>
        {posts.map(({ id, frontmatter, fields }) => (
          <li className="list-item" key={id}>
            <article>
              <div className="meta">
                <span>
                <span className="screen-reader">Posted on </span>
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
      </Container>

    );
  }
  return (
    <Container>
      <Header title={title} />
      <TermCloudContainer tags={tags} slugPrefix={slugPrefix} />
    </Container>
  );
}
