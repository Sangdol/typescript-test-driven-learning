import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { assert } from "chai";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

function waitForCb(
  socket: ServerSocket | ClientSocket,
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: (arg: any) => void
) {
  return new Promise((resolve) => {
    socket.once(event, (arg) => {
      cb(arg);
      resolve(arg);
    });
  });
}

describe("socket.io basic", () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("should be connected", () => {
    assert.equal(serverSocket.connected, true);
    assert.equal(clientSocket.connected, true);
  });

  it("should work with an acknowledgement", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  });

  it("should work with emitWithAck()", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    assert.equal(result, "bar");
  });

  it("should work with waitFor()", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});

describe("socket.io with multiple sockets", () => {
  let io: Server,
    serverSocket1: ServerSocket,
    serverSocket2: ServerSocket,
    clientSocket1: ClientSocket,
    clientSocket2: ClientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket1 = ioc(`http://localhost:${port}?id=1`);
      clientSocket2 = ioc(`http://localhost:${port}?id=2`);
      io.on("connection", (socket) => {
        if (socket.handshake.query.id === "1") {
          serverSocket1 = socket;
        } else {
          serverSocket2 = socket;
        }
      });
      Promise.all([
        waitFor(clientSocket1, "connect"),
        waitFor(clientSocket2, "connect"),
      ]).then(() => done());
    });
  });

  after(() => {
    io.close();
    clientSocket1.disconnect();
    clientSocket2.disconnect();
  });

  it("should work for each socket", async () => {
    const w1 = waitForCb(clientSocket1, "hello", (arg) => {
      assert.equal(arg, "world1");
    });
    const w2 = waitForCb(clientSocket2, "hello", (arg) => {
      assert.equal(arg, "world2");
    });

    serverSocket1.emit("hello", "world1");
    serverSocket2.emit("hello", "world2");

    await Promise.all([w1, w2]);
  });
});

describe("socket.io with namespace", () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}/nsp`);
      io.of("/nsp").on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });
});
