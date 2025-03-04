import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
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

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Sync the database
db.sequelize
  .sync({ force: false, logging: false })
  .then(() => console.log("🚀 ~ Database connected successfully....."))
  .catch((err: Error) => console.error("Failed to sync db: " + err.message));

// Apollo server for GraphQL
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: ({ req }) => {
    const user = authenticateJWT(req);
    return { user, io }; // Pass socket.io instance to resolvers
  },
});

async function startServer() {
  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Start Express server with HTTP + WebSockets
    server.listen(PORT, () => {
      console.log(
        `🔔 ~ Server running at http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  } catch (err) {
    console.error("Server startup failed:", err);
  }
}

startServer();

export { io };
