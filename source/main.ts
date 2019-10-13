import { ApolloServer } from "apollo-server"
import { ObjectId } from "mongodb"
import { connect } from "mongoose"
import * as path from "path"
import "reflect-metadata"
import { buildSchema } from "type-graphql"

import { ObjectIdScalar } from "./objectId.scalar"
import resolvers from "./resolvers"
import typegooseMiddleware from "./typegooseMiddleware"

export const MONGODB_URI = "mongodb://localhost:27017/bonsai-backend-test"
export const PORT = 4000

const main = async () => {
  try {
    await connect(
      MONGODB_URI,
      { useNewUrlParser: true ,
      useFindAndModify: true
    }
    ).then(() => console.log("MongoDB Connected"))
  
  } catch (mongoConnectError) {
    console.error(mongoConnectError)
  }
  try {
    const schema = await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      globalMiddlewares: [typegooseMiddleware],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    })
    const server = new ApolloServer({ schema, context: {} })
    const { url } = await server.listen(PORT)
    console.log(`GraphQL Playground running at ${url}`)
  } catch (apolloError) {
    console.error(apolloError)
  }
}

main()
