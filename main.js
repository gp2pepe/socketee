"use strict";
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const WebSocket = require('ws')
var client 
let win

function createWindow () {
   win = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

ipcMain.on('connect',  (event,args) => {
  client = new WebSocket(args);
  var mensaje = "";
  client.onopen = () => {
    mensaje = "Connected";
    win.webContents.send('repuestaConn',mensaje);

  }

  client.onerror = (error) => {
    mensaje = `WebSocket error: ${error}`;
    win.webContents.send('repuestaConn',mensaje);

  }

});


ipcMain.on('send', function (){
 // Wait for the client to connect using async/await
  //await new Promise(resolve => client.once('open', resolve));
    console.log("Voy a mandar mensaje")
    client.send('Message From Client') 
  client.onmessage = (e) => {
    client.log(e.data)
  }
});




app.whenReady().then(() => {
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
