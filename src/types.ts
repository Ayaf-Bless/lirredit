import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import express, { Response, Request } from "express";
import * as QueryString from "querystring";

export type MyContext = {
  em: EntityManager;
  req: Request & { session: { userId?: number } };
  res: Response;
};
