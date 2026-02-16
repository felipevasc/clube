import { spawn } from "node:child_process";

const procs = [];
const isWindows = process.platform === "win32";

function killProcTree(p, signal) {
  if (!p?.pid) return;
  try {
    // When `detached: true` on POSIX, the child becomes process group leader.
    // Killing the group prevents orphaned grandchildren (e.g. node --watch).
    if (!isWindows) process.kill(-p.pid, signal);
    else process.kill(p.pid, signal);
  } catch { }
}

function run(name, args) {
  const p = spawn(args[0], args.slice(1), {
    stdio: "inherit",
    env: process.env,
    detached: !isWindows,
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
    killProcTree(p, "SIGTERM");
  }

  // Escalate if something is stuck.
  setTimeout(() => {
    for (const { p } of procs) killProcTree(p, "SIGKILL");
  }, 2500).unref();

  // Give children time to exit; then hard-exit.
  setTimeout(() => process.exit(code), 3000).unref();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("gateway", ["pnpm", "--filter", "@clube/gateway-api", "dev"]);
run("users", ["pnpm", "--filter", "@clube/users", "dev"]);
run("books", ["pnpm", "--filter", "@clube/books", "dev"]);
run("groups", ["pnpm", "--filter", "@clube/groups", "dev"]);
run("feed", ["pnpm", "--filter", "@clube/feed", "dev"]);
run("web", ["pnpm", "--filter", "@clube/web", "dev"]);
