---
title: "Creating pages in Gatsby"
date: "2018-01-28T23:48:06+0800"
categories: ['Code', 'Getting into Gatsby']
tags: ['Gatsby']
excerpt: Creating pages in Gatsby can be easy, and can be complicated too! This is the minimal code you'll need to create a blog, with content from Markdown files.
---

> This is part of a series of Gatsby posts focusing on what I've learnt while setting up this blog, [see other related posts in the series here](/categories/Getting%20into%20Gatsby).

#### Recap
We've set up our Gatsby project, configured it to read Markdown files from the directory, talked briefly about what plugins do. [See the full article here](/blog/2018-01-16-gatsby-config/).

# Two methods to create pages in Gatsby

###### Put your React components in `src/pages`
Gatsby will automatically turn those components into pages. The path and filename of the component will be used as the path to your page.

`src/pages/blog/my-first-blog.js` to `http://localhost:8000/blog/my-first-blog`

###### Implement the `createPages` API
This method is mainly used for creating pages from a data source, by applying the data into a template you specify. For this blog, I've used this API to source data from Markdown files residing in the project. While writing this, I'm also currently working on getting data from [Firestore](https://firebase.google.com/docs/firestore/), which will be in a future post.

The first method is quite self-explanatory, we'll focus on the second method instead.

> ###### Good to know
> By default, all pages will use the layout found in  `layouts/index.js`.

If you wish to use another layout, specify which layout to use when creating the page by implementing `createPages`, or modify the created pages by implementing `onCreatePage`. [The Gatsby documentation explains very well on this](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#choosing-the-page-layout).

## Implementing `createPages` API
Let's get to work, first we will implement `createPages` API in `gatsby-node.js` which should be in your project's root. While we're on that, we will also implement `onCreateNode`, which we will use it to extend the nodes created by `gatsby-transformer-remark`.

Another thing to note is, I prefer to have my source directory to be in symmetry with my website, i.e.

`src/pages/blog/my-first-post/index.md` to `http://localhost:8000/blog/my-first-post`

Notice that it's the same pattern with how Gatsby find and create pages from our React components?

**Enough babbling, let's get started!**

---

##### First up, configure `gatsby-source-filesytem` to read where our Markdown files are.

`embed:creating-pages/gatsby-config.js`

##### Then, extend the `MarkdownRemark` nodes to add a slug.

`embed:creating-pages/onCreateNode.js`

Anytime you want to check what fields are available at the node, use GraphiQL.

`embed:creating-pages/find-fields.graphql`
Outputs
`embed:creating-pages/find-fields-output.json`

##### Third step, create a template for our post
This will be a simple template which we show only the title and its content. In a future post, we will discuss about components which we can use to make a complex post template, using [GraphQL fragments](http://graphql.org/learn/queries/#fragments).

`embed:creating-pages/template.js`

The example code should be self explanatory, we'll see how the `$slug` is passed into the GraphQL query, look out for __*See my slug!*__ sign.


> **Note:** GraphQL will throw error if you do not have a MD file with the title field in frontmatter. This is because Gatsby infers the available fields on during build time, which is when you start the development server. To fix this, just add some fields into your first blog post, and leave them blank.

##### With all things set, it's time to create those pages!

`embed:creating-pages/createPages.js`

This should be easy to understand. Now, navigate to http://localhost:8000/404 to see what pages have been created for you!

Leave comment below if you encountered any problems. To smoothen the process, put up a reproducible repo in GitHub!

Next up, we look into utilizing components and GraphQL fragment to build up the layout of our blog (or my blog, I've been refactoring while writing this up), and also how to create tags.

Until then.
