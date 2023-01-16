// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function commentAPI(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }
import { GraphQLClient, gql } from 'graphql-request';
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHICS_ENDPOINT
const graphcmsToken = process.env.GRAPHCMS_TOKEN
export default async function commentAPI(req, res) {
  const { name, email, slug, comment } = req.body
  const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
      authorization: `Bearer ${graphcmsToken}` // go to graphcms to get the token --> project settings,permanent auth tokens, create token, copy and put in env
    }
  })
  // mutation is graph ql means update or adding a new data
  const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!){
      createComment(data: {name: $name, email: $email, comment: $comment, post: { connect: {slug: $slug }}}){id}
    }
  `
  try{
    const result = await graphQLClient.request(query, req.body)
    return res.status(200).send(result);
  }
  catch(error){
    console.log(error)
    return res.status(500).send(error);

  }
}


