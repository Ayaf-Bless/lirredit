import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import * as redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import cors from "cors";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  await redisClient.on("error", (err) => {
    console.log("Error ");
  });
  await redisClient.on("ready", () => {
    console.log("✅ 💃 redis have ready !");
  });

  await redisClient.on("connect", () => {
    console.log("✅ 💃 connect redis success !");
  });
  app.use(
    cors({
      credentials: true,
      origin: "https://studio.apollographql.com",
    })
  );
  app.set("trust proxy", 1);
  app.use(
    session({
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: "my long and strong secret key",
      resave: false,
      name: "qui",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 + 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "none",
      },
      saveUninitialized: false,
    })
  );

  const apolloSever = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  await apolloSever.start();
  apolloSever.applyMiddleware({
    app,
    cors: { credentials: true, origin: "https://studio.apollographql.com" },
  });
  app.listen(4000, () => {
    console.log("server has started on 4000");
  });
};

main().catch((e) => {
  console.log(e);
});
