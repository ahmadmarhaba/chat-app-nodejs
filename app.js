require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json())
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs  , doc, setDoc} = require('firebase/firestore');
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
  

  const firebaseConfig = {
    apiKey: "AIzaSyADhLUAb4Guot2ev1md_yE-rPqZnin5qi0",
    authDomain: "chat-app-nextjs-4981b.firebaseapp.com",
    projectId: "chat-app-nextjs-4981b",
    storageBucket: "chat-app-nextjs-4981b.appspot.com",
    messagingSenderId: "725063820157",
    appId: "1:725063820157:web:c58ebd5a15a84fa296e214",
    measurementId: "G-T0M26G4MWD"
  };
  
  const appFirebase = initializeApp(firebaseConfig);
  const db = getFirestore(appFirebase);

io.on('connection', function (socket) {
  serverLog("Connection Started ( Socket id: " + socket.id + " )");
  socket.on("joinRoom",(data)=>{
    const room1 = (data.friendId+ "/" + data.userId);
    const room2 = (data.userId+ "/" + data.friendId);
    socket.join([room1, room2]);
    // socket.emit('joinRoom')
  })
  
  socket.on('sendMessage', async function (data) {
    // if (!chatInfo) return;
    if(!data && !data.message
      //  && !data.folderName
      ) return;
    // let folderName = data.folderName;
    // let tempFiles = [];
    // if(folderName){
    //   tempFiles = await axios.post('/CheckTempDirectory',{
    //     token : user.token,
    //     folderName : folderName,
    //     directoryType : "ChatFiles"
    //   })
    //   .then(function (res) {
    //       if(res && res.data && res.data.ok && res.data.tempFiles)
    //         return res.data.tempFiles;
    //       else
    //         return [];
    //   }).catch(function (error) : [] {
    //     if(error) connection.log("CheckTempDirectory: Encountered error no file collected")
    //     return [];
    //   });
    // }
    // if(folderName && tempFiles.length == 0) return;
    // connection.log(`Sending message to userID ${ChatingWithUser.id}`)
    let message = {
     FromUser_ID : data.userId,
     ToUser_ID : data.friendId,
     Group_ID : null,
     Text_Message :data.message,
     Text_Date: (new Date()).getTime(),
     Text_Status: "sent",
     Text_View : "unseen",
     Text_Flag : "active",
     Text_Edit: "original",
     Text_MediaFiles : null,
     Text_MediaFolder : null,
    }
    let roomId = data.userId+ "/" + data.friendId;
    const list = collection(db, "messages")
    const newCityRef = doc(list);
    await setDoc(newCityRef, message);

    // server.database.saveMsg(data.userID, data.friendID, data.message,
      // chatInfo.groupID,  folderName, tempFiles,
        //  async (dataD) => {
      // let isMedia = folderName && tempFiles && tempFiles.length != 0
      // if(isMedia){
      //   const filesMoved = await axios.post('/CreateDirectory',{
      //     token : user.token,
      //     folderName : folderName,
      //     directoryType : "ChatFiles",
      //     tempFiles
      //   })
      //   .then(function (res) {
      //     if(res && res.data && res.data.ok)
      //       return true;
      //     else 
      //       return false;
      //   }).catch(function (error) {
      //     if(error) connection.log("CreateDirectory: Encountered error no file Moved")
      //     return false;
      //   });
      //   if(!filesMoved) return;
      // }

      if(newCityRef.id){
        let msgData = {
          textID: newCityRef.id,
          oldID : data.oldId,
          myself: true,
          // folderName,
          // tempFiles,
          // isMedia
        }
        socket.emit('sendMessage', msgData)
      }
      // if(!chatInfo) return;
      const returnData = {
        message: data.message,
        textID: newCityRef.id,
        userId: data.userId,
        unSeenMsgsCount: 0,
        myself: false,
        folderName: null,
        tempFiles: null,
        isMedia: null,
      }
      
      // if(chatInfo.groupID) connection.everySocketInLobby('sendMessage' , chatInfo.groupID , returnData)
      // else
      if(data.friendId){
        socket.to(roomId).emit('sendMessage', returnData);
        // server.database.msgsRecieved(data.userId, data.friendId, () => {
        //   socket.emit('msgsRecieved', { id : data.friendId})
        //   friendConn.everySocket('msgsRecievedWhileNotTalkingWithUser', returnData)
        // })
      }
    // })
  })
  socket.on('showChatHistory', (data) => {
    // if(!chatInfo) return;

    // connection.log("Fetching chat history for user "+ ChatingWithUser.id)
    // server.database.showChatHistory(userID, chatInfo.userID , chatInfo.groupID, data.page, (dataD) => {

      // socket.emit('showChatHistory', {
      //   refresh : data.refresh,
      //   chatLog: dataD.chatLog,
      //   name: user.name,
      //   code: user.code,
      //   page: data.page + 25,
      //   unSeenMsgsCount : dataD.unSeenMsgsCount
      // });
      // if(socket && chatInfo && chatInfo.userID) socket.emit("removeMsgsRecievedAlert" , {
      //   name: chatInfo.name,
      //   code: chatInfo.code
      // })
      // if (!chatInfo) return;
      // let myData = {
      //   name: user.name,
      //   code: user.code
      // }
      // if(data.friendId){
        let roomId = data.userId+ "/" + data.friendId;
          socket.to(roomId).emit('msgsSeen', { userId : data.userId })
      // }
    // })
  });
})