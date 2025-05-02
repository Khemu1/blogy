// test-utils/nextServer.ts
import { createServer } from "http";
import next from "next";

let server: any;

export async function startNextServer() {
  const app = next({ dev: true });
  const handle = app.getRequestHandler();

  await app.prepare();

  server = createServer((req, res) => handle(req, res));

  return new Promise<{ url: string }>((resolve) => {
    server.listen(3001, () => {
      resolve({ url: "http://localhost:3001" });
    });
  });
}

export async function stopNextServer() {
  if (server) {
    server.close();
  }
}
