"use strict";
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const WebSocket = require('ws');
const settings = require('electron-settings');

var client 
let win

function createWindow () {
   win = new BrowserWindow({
    width: 650,
    height: 820,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      frame: false
    },
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  win.setMenuBarVisibility(true)
  win.loadFile('index.html')
}

//Connects to websocket
ipcMain.on('connect',  (event,args) => {
  var mensaje = "URL format incorrect";
  try{
    client = new WebSocket('ws://' + args);
    client.onopen = () => {
      mensaje = "Connected";
      win.webContents.send('responseConn',mensaje);

    }

    client.onerror = (error) => {
      mensaje = 'WebSocket error - check URL or Server ';
      win.webContents.send('responseConn',mensaje);

    }
  }catch(error){
    win.webContents.send('responseConn',"Wrong URL format");
  }
});

//Send message to the server and retrive response
ipcMain.on('send', (event,args) => {

    try{
      console.log("Sending Message: " + args);
      client.send(args);
      client.onmessage = (e) => {
        win.webContents.send('responseMessage',e.data);
      }
    }catch (error){
      win.webContents.send('responseMessage',"Error sending message: " + error);
    }
});

ipcMain.on('saveURL', (event,args) => {

  try{
    settings.set('key', {
        url: args
    });
    win.webContents.send('responseSave','Saved');
  }catch (error){
    win.webContents.send('responseSave',"Error");
  }
});

ipcMain.on('loadSaved', (event,args) => {

  try{
  
      settings.has('key.url').then(bool => {
        settings.get('key.url').then(value => {
          if(value!=undefined)
            win.webContents.send('responseSavedURL',value);
        })
      });

  }catch (error){
    win.webContents.send('responseSave',"Error");
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
