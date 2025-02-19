import express from "express";
import dotenv from "dotenv";
import db from "./models/index.model";
import typeDefs from "./graphql/index.graphql";
import resolvers from "./graphql/resolvers/index.resolver";
import { ApolloServer } from "apollo-server-express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 4000;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync the database
db.sequelize
  .sync()
  .then(() => {
    console.log("🚀 ~ Database is connected successfully.....");
  })
  .catch((err: Error) => {
    console.error("Failed to sync db: " + err.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
});

async function startServer() {
  console.log("calling------------>");
  try {
    await server.start();
    server.applyMiddleware({ app });

    // Start the express server
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
