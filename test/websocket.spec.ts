import { createServer } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { assert } from "chai";

function waitForOpen(ws: WebSocket) {
  return new Promise((resolve) => {
    ws.once("open", resolve);
  });
}

function waitForMessage(ws: WebSocket) {
  return new Promise((resolve) => {
    ws.once("message", (data) => {
      resolve(data);
    });
  });
}

describe("WebSocket tests", () => {
  let server: ReturnType<typeof createServer>;
  let wss: WebSocketServer;
  let client: WebSocket;

  before((done) => {
    server = createServer();
    wss = new WebSocketServer({ server });

    server.listen(() => {
      const port = (server.address() as WebSocket.AddressInfo).port;
      client = new WebSocket(`ws://localhost:${port}`);

      wss.on("connection", (ws) => {
        ws.on("message", (message) => {
          ws.send(message); // Echo the received message
        });
      });

      waitForOpen(client).then(done);
    });
  });

  after(() => {
    client.close();
    wss.close();
    server.close();
  });

  it("echoes messages", async () => {
    const testMessage = "Hello WebSocket";
    client.send(testMessage);
    const receivedMessage = await waitForMessage(client);
    assert.equal(receivedMessage, testMessage);
  });
});
