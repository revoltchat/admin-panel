import { readFileSync } from "fs";
import { Document, MongoClient } from "mongodb";
import { resolve } from "path";

/**
 * Global handle shared in process
 */
let client: MongoClient;

/**
 * Fetch handle to MongoDB client
 * @returns Mongo client
 */
function mongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB!);
  }

  return client;
}

/**
 * Fetch handle to MongoDB database
 * @param name Database name
 * @returns Database handle
 */
export function db(name: string = "revolt") {
  return mongo().db(name);
}

/**
 * Fetch handle to MongoDB collection
 * Uses the `revolt` database by default
 * @param name Collection name
 * @returns Collection handle
 */
export function col<T extends Document>(name: string) {
  return db().collection<T>(name);
}

export default mongo;
