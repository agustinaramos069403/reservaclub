import express, { type Express } from "express";

export function createApplication(): Express {
  const application = express();
  application.use(express.json());
  return application;
}
