/**
 * Start Next.js dev on the first free port from PORT (default 3003), then open the browser.
 */

const http = require("http");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const { execFile } = require("child_process");

const HOST = process.env.HOSTNAME || "localhost";
const START_PORT = Number(process.env.PORT) || 3003;
const MAX_PORT_TRIES = 50;
const projectRoot = path.join(__dirname, "..");
const nextBin = path.join(projectRoot, "node_modules", ".bin", "next");

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, HOST === "0.0.0.0" ? "0.0.0.0" : "127.0.0.1");
  });
}

async function findAvailablePort(startPort) {
  for (let offset = 0; offset < MAX_PORT_TRIES; offset += 1) {
    const port = startPort + offset;
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(
    `No free port found between ${startPort} and ${startPort + MAX_PORT_TRIES - 1}`,
  );
}

function waitForServer(url, maxAttempts = 120) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts += 1;
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });

      req.on("error", () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error(`Dev server did not respond at ${url}`));
          return;
        }
        setTimeout(check, 500);
      });

      req.setTimeout(2000, () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error(`Dev server did not respond at ${url}`));
          return;
        }
        setTimeout(check, 500);
      });
    };

    setTimeout(check, 800);
  });
}

function openBrowser(url) {
  if (process.env.BROWSER === "none") return Promise.resolve();
  if (process.platform === "darwin") {
    return new Promise((resolve) => {
      execFile("open", [url], () => resolve());
    });
  }
  return Promise.resolve();
}

async function main() {
  const port = await findAvailablePort(START_PORT);
  const url = `http://${HOST}:${port}`;

  if (port !== START_PORT) {
    console.log(`[dev] Port ${START_PORT} is in use — starting on ${port}`);
  }

  const child = spawn(nextBin, ["dev", "--port", String(port)], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
      WATCHPACK_POLLING: "true",
      CHOKIDAR_USEPOLLING: "true",
    },
  });

  let browserOpened = false;

  waitForServer(url)
    .then(async () => {
      if (browserOpened) return;
      browserOpened = true;
      await openBrowser(url);
    })
    .catch((err) => {
      console.warn(`[dev] Browser not opened: ${err.message}`);
    });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      if (!child.killed) child.kill(signal);
    });
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
