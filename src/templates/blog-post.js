import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import ReactDisqusComments from 'react-disqus-comments';
import { urlize } from 'urlize';

import BlogHeader from '../components/BlogHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/layout'

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-1902375535724633",
      enable_page_level_ads: true
    });
  }

  render() {
    const { markdownRemark: post, site: { siteMetadata } } = this.props.data
    const { next, prev } = this.props.pageContext;
    const tags = post.frontmatter.tags || [];
    const categories = post.frontmatter.categories || [];

    return (
      <Layout location={this.props.location}>
        <main className="main">
          <Helmet post={post} siteMetadata={siteMetadata} />
          <article lang="en" className="entry">
            <BlogHeader post={post} siteMetadata={siteMetadata} />
            <div className="entry-content" dangerouslySetInnerHTML={{ __html: post.html }} />
            {(tags.length > 0 || categories.length > 0) &&
              <footer className="entry-footer-container">
                <div className="entry-footer">
                  {categories.length > 0 &&
                    <div className="categories">
                      <span className="taxonomyTerm-icon">
                        <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M22,19a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3H9l2,3h9a2,2,0,0,1,2,2Z"></path>
                      </svg>
                      </span>
                      <span className="screen-reader">Categories: </span>
                      {categories.map((category) => (
                        <Link key={category} className="category" to={`/categories/${urlize(category)}`}>
                          {category}
                        </Link>
                      ))}
                    </div>
                  }
                  {tags.length > 0 &&
                    <div className="tags">
                      <span className="taxonomyTerm-icon">
                        <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M20.59,13.41l-7.17,7.17a2,2,0,0,1-2.83,0L2,12V2H12l8.59,8.59A2,2,0,0,1,20.59,13.41Z"></path>
                          <line x1="7" y1="7" x2="7" y2="7"></line>
                        </svg>
                      </span>
                      <span className="screen-reader">Tags: </span>
                      {tags.map((tag) => (
                        <Link key={tag} className="tag" to={`/tags/${urlize(tag)}`}>
                          {tag}
                        </Link>
                      ))}
                    </div>
                  }
                </div>
              </footer>
            }
          </article>
          {(prev || next) &&
            <nav className="entry-nav-container">
              <div className="entry-nav">
                {prev &&
                  <div className="prev-entry">
                    <Link to={prev.fields.slug}>
                      <span>
                        <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <line x1="20" y1="12" x2="4" y2="12"></line>
                          <polyline points="10 18 4 12 10 6"></polyline>
                        </svg>
                        &nbsp;Previous
                      </span>
                      <span className="screen-reader">Previous post: </span>
                      {prev.frontmatter.title}
                    </Link>
                  </div>
                }
                {next &&
                  <div className="next-entry">
                    <Link to={next.fields.slug}>
                      <span className="screen-reader">Next post: </span>
                      {next.frontmatter.title}
                      <span>
                        Next&nbsp;
                        <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <line x1="4" y1="12" x2="20" y2="12"></line>
                          <polyline points="14 6 20 12 14 18"></polyline>
                        </svg>
                      </span>
                    </Link>
                  </div>
                }
              </div>
            </nav>
          }
          {process.env.NODE_ENV === 'production' &&
            <ReactDisqusComments
              className="comments-container"
              shortname="yaobin"
              identifier={post.id}
              title={post.frontmatter.title}
              url={`${siteMetadata.siteUrl}${post.fields.slug}`}
            />
          }
        </main>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        siteUrl
        fbAppId
      }
      ...Helmet_siteMetadata
      ...BlogHeader_siteMetadata
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        tags
        categories
      }
      ...Helmet_post
      ...BlogHeader_post
    }
  }
`
