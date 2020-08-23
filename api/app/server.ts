/** @format */

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { connect } from "mongoose";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ServiceCatalogItemResolver } from "./resolvers/ServiceCatalogItemResolver";
import { UserResolver } from "./resolvers/UserResolver";


const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      ServiceCatalogItemResolver,
      UserResolver
    ],
    emitSchemaFile: true,
    validate: false,
  });

  // create mongoose connection
  const mongoose = await connect(
    "mongodb://svccat:svccat@localhost:27017/svccat",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await mongoose.connection;

  const server = new ApolloServer({ schema });
  const app = Express();
  server.applyMiddleware({ app });
  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`
    )
  );
};
main().catch((error) => {
  console.log(error, "error");
});
