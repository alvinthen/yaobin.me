const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const urlize = require('urlize').urlize;

const createTagPages = (createPage, edges, title) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`);
  const tags = {};

  edges.forEach(({ node }) => {
    // Quick and dirty hack
    if (node.frontmatter[`${title.toLowerCase()}`]) {
      node.frontmatter[`${title.toLowerCase()}`].forEach((tag) => {
        if (!tags[tag]) {
          tags[tag] = {
            slug: urlize(tag),
            posts: [],
          };
        }
        tags[tag].posts.push(node);
      });
    }
  });

  const tagsPath = `/${title.toLowerCase()}`
  createPage({
    path: tagsPath,
    component: tagTemplate,
    context: {
      slugPrefix: tagsPath,
      tags,
      title,
    }
  });

  Object.keys(tags).forEach(tagName => {
    const posts = tags[tagName].posts;
    const tagPath = `${tagsPath}/${urlize(tagName)}`;
    createPage({
      path: tagPath,
      component: tagTemplate,
      context: {
        slug: tagPath,
        posts,
        tag: tagName,
        title,
      }
    })
  });
};

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
  return graphql(`{
    allMarkdownRemark(
      filter: { fields: { slug: { ne: "/about" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "YYYY, MMM DD")
            dateTime: date
            tags
            categories
          }
          fields {
            slug
          }
        }
      }
    }
    about: markdownRemark(fields: { slug: { eq: "/about" }}) {
      id
    }
  }`)
  .then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { about, allMarkdownRemark: { edges: posts } } = result.data;

    // Create About page
    createPage({
      path: '/about',
      component: blogPostTemplate,
      context: {
        slug: '/about',
      }
    });

    // Create pages for each markdown file.
    posts.forEach(({ node }, index) => {
      const prev = index === 0 ? null : posts[index - 1].node;
      const next = index === posts.length - 1 ? null : posts[index + 1].node;
      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
          prev,
          next
        }
      });
    });

    createTagPages(createPage, posts, 'Tags');
    createTagPages(createPage, posts, 'Categories');

    return posts;
  })
  .catch(e => console.error(e))
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark` && getNode(node.parent).internal.type === `File`) {
    if (node.frontmatter.slug) {
      createNodeField({
        name: `slug`,
        node,
        value: node.frontmatter.slug,
      });
      return;
    }

    const fileNode = getNode(node.parent);
    if (fileNode.sourceInstanceName === 'pages') {
      let slug;
      if (fileNode.relativeDirectory) {
        // Remove date stamp in front, it's only useful for arranging our files/folders
        const paths = fileNode.relativeDirectory.split('/');
        const directParent = paths.pop();
        const dateString = directParent.substring(0, 10);

        if (isNaN(new Date(dateString).valueOf())) {
          // We'll use the path to the MD file as the slug.
          // eg: http://localhost:8000/blog/my-first-post
          slug = `/${fileNode.relativeDirectory}`;
        } else {
          // Remove the trailing hypen after the dateString
          slug = `/${paths.join('/')}/${directParent.substring(11)}`;
        }
      } else {
        // If the MD file is at src/pages, we'll use the filename instead.
        // eg: http://localhost:8000/about
        slug = `/${fileNode.name}`;
      }

      if (slug) {
        createNodeField({
          name: `slug`,
          node,
          value: slug,
        })
      }
    }
  }
};
