const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('btnConnect').addEventListener('click', function(e){
    let resu = ipcRenderer.sendSync('connect');
    console.log(resu);
    document.getElementById('estado-con').setText = resu;
});

document.getElementById('btnSend').addEventListener('click', function(e){
    ipcRenderer.send('send');
});