import { Document, MongoClient } from "mongodb";
import { Database, Err, database, init } from "revolt-nodejs-bindings";

/**
 * Global handle to Mongo shared in process
 */
let client: MongoClient;

/**
 * Global handle to binding database shared in process
 */
let bindDatabase: Database;

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
 * Fetch handle to binding database
 * @returns database
 */
export function revoltDb() {
  if (!bindDatabase) {
    bindDatabase = database();
  }

  return bindDatabase;
}

/**
 * Call a procedure from the Revolt backend
 */
export async function callProcedure<A extends any[], R>(
  fn: (...args: A) => R,
  ...args: A
): Promise<R> {
  await init();
  const result = await fn.bind(revoltDb())(...args);
  if ((result as { error?: Err }).error)
    throw new Error(
      (result as { error: Err }).error.type +
        " in " +
        (result as { error: Err }).error.location,
    );
  return result;
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
