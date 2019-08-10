module.exports = {
  siteMetadata: {
    title: 'Yaobin',
    author: 'Yaobin',
    description: 'Software engineer from Malaysia, coding from backend to frontend, at any cafés. ',
    siteUrl: 'https://yaobin.me',
    twitter: '@yaobinme',
    instagram: 'yaobin.dev',
    facebook: 'yaobin.me',
    email: 'me@yaobin.me',
    github: 'alvinthen',
    fbAppId: '2176625045898163',
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              usePrefix: ['insta'],
              providers: {
                include: ['Instagram']
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              linkImagesToOriginal: false
            },
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 400
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-katex',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-external-links',
          {
            resolve: 'gatsby-remark-embed-snippet',
            options: {
              directory: `${__dirname}/snippets/`,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-73797886-1`,
      },
    },
    `gatsby-plugin-feed`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-sitemap`
  ],
}
