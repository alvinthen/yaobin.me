// gatsby-node.js
exports.createPages = async ({ boundActionCreators, graphql }) => {
  // Get the template we created!
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`); // Get the template

  // This is the action to tell Gatsby to create the pages for us
  const { createPage } = boundActionCreators;

  try {
    // First we get all the pages that are not the About page
    // Then we get the About page
    const result = await graphql(`{
      allMarkdownRemark(
        fields: { slug: { ne: "/about" }}
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }

      about: markdownRemark(fields: { slug: { eq: "/about" }}) {
        id
      }
    }`);

    // GraphQL errors
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { about, allMarkdownRemark: { edges: posts } } = result.data;

    // Create About page
    createPage({
      path: '/about',
      component: blogPostTemplate,
      context: {
        slug: '/about', // See my slug!
      }
    });

    // Create pages for each markdown file.
    posts.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug, // See my slug!
        }
      });
    });

    // Signal Gatsby that we're done
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
