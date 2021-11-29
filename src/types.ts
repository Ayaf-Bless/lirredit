import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Response, Request, Express } from "express";
import session from "express-session";

export type MyContext = {
  em: EntityManager;
  req: any;
  res: Response;
};
