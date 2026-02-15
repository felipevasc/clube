import { spawn } from "node:child_process";

const procs = [];

function run(name, args) {
  const p = spawn(args[0], args.slice(1), {
    stdio: "inherit",
    env: process.env,
  });
  procs.push({ name, p });
  p.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[dev] ${name} exited with signal ${signal}`);
    } else if (code && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`);
    }
    // If any process dies, shut everything down to avoid a half-alive dev stack.
    shutdown(code || 0);
  });
}

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const { p } of procs) {
    try {
      p.kill("SIGTERM");
    } catch {}
  }
  // Give children a moment to exit; then hard-exit.
  setTimeout(() => process.exit(code), 500).unref();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("gateway", ["pnpm", "--filter", "@clube/gateway-api", "dev"]);
run("users", ["pnpm", "--filter", "@clube/users", "dev"]);
run("books", ["pnpm", "--filter", "@clube/books", "dev"]);
run("groups", ["pnpm", "--filter", "@clube/groups", "dev"]);
run("feed", ["pnpm", "--filter", "@clube/feed", "dev"]);
run("web", ["pnpm", "--filter", "@clube/web", "dev"]);

