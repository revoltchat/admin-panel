import { Document, MongoClient } from "mongodb";

/**
 * Global handle shared in process
 */
let client: MongoClient;

/**
 * Fetch handle to MongoDB client
 * @returns Mongo client
 */
function mongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB!);
  }

  return client;
}

/**
 * Create a collection handle generator for given parameters
 * @param db Database Name
 * @param col Collection Name
 * @returns Factory
 */
export function createCollectionFn<T extends Document>(
  db: string,
  col: string,
) {
  return () => mongoClient().db(db).collection<T>(col);
}

export * from "./hr";
