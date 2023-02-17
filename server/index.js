const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const Room = require("./models/room");
const User = require("./models/user");
const HttpError = require("./models/http-error");

const bodyParser = require("body-parser");

const authRouter = require("./routers/authRouter");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let rooms = {};

io.on("connection", async (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  console.log(id + " - connected");

  socket.on("exit-room", async (roomId, cb) => {
    try {
      socket.leave(roomId);
      let playerId = await User.findOne({ name: id });
      let room = await Room.findOne({ roomId: roomId });
      console.log("room - ", room);
      let index = room.players.indexOf(playerId._id);
      room.players.splice(index, 1);
      delete rooms[roomId];
      await room.save();
      let roomsAfterPlayerExit = await Room.find({}, "-_id -__v");

      io.emit("get-all-rooms", roomsAfterPlayerExit);
    } catch (err) {
      console.log("exit-room", err);
    }

    try {
      let room2 = await Room.findOne({ roomId: roomId }).populate("players", [
        "name",
      ]);
      let playersInTheRoom = room2.players.map((player) => player.name);
      let reset = true;
      io.to(roomId).emit("join-player", playersInTheRoom, reset);
    } catch (err) {
      console.log("exit-room-reset", err);
    }
  });

  socket.on("join-room", async (roomId, cb) => {
    try {
      socket.join(`${roomId}`);

      const rooms = await Room.find({}, "-_id -__v");
      socket.broadcast.emit("get-all-rooms", rooms);
      cb({ rooms: rooms });
    } catch (error) {
      console.log("join-room", error);
    }
  });

  socket.on("player-joined", async (roomId, username, cb) => {
    try {
      console.log("socket id ----- ", socket.id);
      socket.join(`${roomId}`);
      let playersInTheRoom = [];
      let room = await Room.findOne({ roomId: roomId }).populate("players", [
        "name",
      ]);
      playersInTheRoom = room.players.map((player) => player.name);
      console.log("players in the room - ", playersInTheRoom);
      let reset = false;

      io.to(roomId).emit("join-player", playersInTheRoom, reset);
    } catch (err) {
      console.log("player joined", err);
    }
  });

  socket.on("make-move", async (move) => {
    //scissors === 0
    //paper === 1
    // rock === 2
    try {
      let roomId = move.roomId;
      const draw = "draw";
      let winner;
      if (!rooms[roomId] || rooms[roomId].length === 0) {
        rooms[roomId] = [];
        rooms[roomId].push({
          username: move.username,
          choice: move.choice,
        });

        io.in(roomId).emit("player-moved", rooms[roomId][0]);
      } else {
        rooms[roomId].push({
          username: move.username,
          choice: move.choice,
        });
        console.log("Rooms after first move of player", rooms);
        if (rooms[roomId][0].choice === rooms[roomId][1].choice) {
          io.in(roomId).emit("winner", draw, rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 0 &&
          rooms[roomId][1].choice === 1
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][0].username,
          });

          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][1].username,
          });

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][0], rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 1 &&
          rooms[roomId][1].choice === 0
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][1].username,
          });
          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][0].username,
          });

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][1], rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 0 &&
          rooms[roomId][1].choice === 2
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][1].username,
          });
          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][0].username,
          });

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][1], rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 2 &&
          rooms[roomId][1].choice === 0
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][0].username,
          });
          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][1].username,
          });

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][0], rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 1 &&
          rooms[roomId][1].choice === 2
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][0].username,
          });
          //console.log("winner", winner);
          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][1].username,
          });
          //console.log("loser", loser);

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][0], rooms[roomId]);
        } else if (
          rooms[roomId][0].choice === 2 &&
          rooms[roomId][1].choice === 1
        ) {
          let winner = await User.findOne({
            name: rooms[roomId][1].username,
          });
          winner.winrate.wins = winner.winrate.wins + 1;

          let loser = await User.findOne({
            name: rooms[roomId][0].username,
          });

          loser.winrate.loses = loser.winrate.loses + 1;
          await loser.save();
          await winner.save();
          io.in(roomId).emit("winner", rooms[roomId][1], rooms[roomId]);
        }

        console.log("match in the room", rooms[roomId]);
        rooms[roomId] = [];
      }
    } catch (error) {
      console.log("make move", error);
    }
  });
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", authRouter);

app.post("/rooms/create", async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const createdRoom = new Room({
      roomId: roomId,
      players: [],
    });

    createdRoom.save();

    let rooms = await Room.find({});

    io.emit("create-room", {
      roomId: createdRoom.roomId,
      players: createdRoom.players,
    });
    res.json("Room created");
  } catch (error) {
    console.log("create room", error);
  }
});

app.post("/rooms/allrooms", async (req, res) => {
  try {
    const { username, userId } = req.body;
    let rooms = await Room.find({}, "-_id -__v");
    let user = await User.findOne({ name: username });

    console.log("mainmenu winrate", user.winrate);
    console.log("all rooms - ", rooms);

    res.json({ rooms: rooms, winrate: user.winrate });
  } catch (error) {
    console.log("get all rooms", error);
  }
});

app.delete("/rooms", async (req, res) => {
  try {
    const roomId = req.body.roomId;

    let roomsAfterDeleting = [];
    const roomToDelete = await Room.findOne({ roomId: roomId }).populate(
      "players"
    );
    if (roomToDelete.players.length === 0) {
      await Room.deleteOne({ roomId: roomId });

      roomsAfterDeleting = await Room.find({}, "-_id -__v");
      io.emit("room-deleted", roomsAfterDeleting);
    } else {
      roomsAfterDeleting = await Room.find({}, "-_id -__v");
    }

    res.json(roomsAfterDeleting);
  } catch (err) {
    console.log("delete room", err);
  }
});

app.post("/room/join", async (req, res) => {
  try {
    const roomId = req.body.data.roomId;
    const userId = req.body.data.userId;
    const socket = req.body.data.socket;
    let room = await Room.findOne({ roomId: roomId }).populate("players");

    if (
      !(room.players.length >= 2) &&
      room.players.filter((player) => player.id === userId).length === 0
    ) {
      room.players.push(userId);
      await room.save().then(() => {
        res.json({ room: room, isJoined: true });
      });
    } else if (
      !(room.players.length >= 2) &&
      room.players.filter((player) => player.id === userId).length === 1
    ) {
      res.json({ room: room, isJoined: true });
    } else {
      res.json({ room: room, isJoined: false });
    }
  } catch (err) {
    console.log("join room", err);
  }
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

mongoose.set("strictQuery", true);
const mongooseUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@place-project.98ixmv4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongooseUrl)
  .then(() => {
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log("Server is listening on port 5000");
    });
  })
  .catch((err) => {
    console.log("error - " + err);
  });
