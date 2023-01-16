import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHICS_ENDPOINT;
export const getPosts = async () => {
    const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          node {
            author {
              id
              name
              image {
                url
              }
            }
            createdAt
            slug
            title
            postimage {
              url
            }
            excerpts
            featuredPost
          }
        }
      }
    }

    ` 

    const queryx = gql`
    query MyQuery {
      authorsConnection {
        edges {
          node {
            name
            image {
              url
            }
          }
        }
      }
    }
`

// request(graphqlAPI, query).then((data) => console.log('MPPAAAAA', data.authorsConnection.edges))
    const result = await request(graphqlAPI, query);
    console.log('werey====?', (result.postsConnection.edges))
    return result.postsConnection.edges; // the graphql query you built from CMS
};

export const getRecentPosts = async() => {
  const query = gql`
  query GetPostDetails(){
    posts(
      orderBy: createdAt_ASC
      last: 3
    ){
      title
      postimage{
        url
      }
      createdAt
      slug
    }
  }
  `
  const result = await request(graphqlAPI, query);
  return result.posts;
}


export const getSimilarPosts = async(categories, slug) => {
  const query = gql`
  query GetPostDetails($slug: String, $categories: [String!]){
    posts(
      where: { slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
      last: 3
    ) {
      title
      postimage{
        url
      }
      createdAt
      slug
    }
  }
  `
  const result = await request(graphqlAPI, query, { categories, slug });
  return result.posts;
}

export const getPostDetails = async(slug) => {
  const query = gql`
    query getPostDetails($slug: String!) {
      post(where: {slug: $slug}){
            author { 
              name
              image {
                url
              }
              bio
            }
            createdAt
            slug
            title
            postimage {
              url
            }
            excerpts
            categories{
              name
              slug
            }
            content{
              raw
            }
          }
        }     
    `
  const result = await request(graphqlAPI, query, { slug });
  return result.post; 
}

export const getCategories = async () => {
  const query = gql`
    query GetCategories{
      categories{
        name
        slug
      }
    }
  `
  const result = await request(graphqlAPI, query);
  return result.categories;
}



export const submitComment = async(obj) => {
  const result = await fetch('/api/comment', { // Create a backend in our nextjs api 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
  return result.json();
}


export const getComments = async (slug) => {
  
  const query = gql`
    query GetComments($slug: String!){
      comments(where: { post: { slug: $slug }}){
        name
        createdAt
        comment
      }
    }
  `
const result = await request(graphqlAPI, query, {slug});
console.log('FUXK ==> ', result.comments)
return result.comments
}