require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json())

const server = require('http').Server(app)
const io = require("socket.io")(server,
  {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  }
  ); 
  
  function serverLog(text) {
    console.log("Web Node Server =>", text);
  }
  
  server.listen(process.env.PORT, () => serverLog(`Listening on port ${process.env.PORT}`));
  

io.on('connection', function (socket) {
  serverLog("Connection Started ( Socket id: " + socket.id + " )")
})