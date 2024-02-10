import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

import { bgBlue, bgGreen, bgRed, gray, red } from "@colors/colors";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { createLogger } from "./logger";

async function printVersion() {
  const { version } = JSON.parse(
    await readFile("package.json").then((f) => f.toString())
  );

  console.log("\n");
  createLogger(bgBlue(" Revolt "))(`Swiss Army Knife v${version}`);
}

async function loadModules() {
  const log = createLogger(bgRed(" Modules "));
  const modules = await readdir(resolve("server/.build/server/modules"));
  log(`Found ${modules.length} modules!`);

  for (const moduleName of modules) {
    log(gray(`Initialising ${moduleName}`));
    require(resolve(`server/.build/server/modules/${moduleName}/index.js`));
  }
}

async function startApp() {
  const log = createLogger(bgGreen(" Web "));
  await app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url!, true);
        // const { pathname, query } = parsedUrl;

        await handle(req, res, parsedUrl);
      } catch (err) {
        log(red(`Error occurred handling ${req.url}: ${err}`));
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () =>
        log(`Admin Panel is ready on http://${hostname}:${port}`)
      );
  });
}

printVersion().then(loadModules).then(startApp);
