import express from "express";
import dotenv from "dotenv";
import db from "./models/index.model";
import typeDefs from "./graphql/index.graphql";
import resolvers from "./graphql/resolvers/index.resolver";
import { ApolloServer } from "apollo-server-express";
import { authenticateJWT } from "./middleware/token";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync the database
db.sequelize
  .sync()
  .then(() => console.log("🚀 ~ Database is connected successfully....."))
  .catch((err: Error) => console.error("Failed to sync db: " + err.message));

// Apollo server for graphql
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: ({ req }) => {
    const user = authenticateJWT(req);
    return { user };
  },
});

async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(
        `~ Server running at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (err) {
    console.error("Server startup failed:", err);
  }
}

startServer();
