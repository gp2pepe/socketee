const ipc = require('electron').ipcRenderer;
window.$ = window.jQuery = require('jquery'); 
require('./lib/jquery.jsonPresenter.js');

let connMessage = document.querySelector('#state-con');

document.getElementById('btnConnect').addEventListener('click', function(e){
    ipc.send('connect',document.getElementById('url').value);

});

document.getElementById('btnSend').addEventListener('click', function(e){
    ipc.send('send',document.getElementById('textSend').value);
});


ipc.on('responseConn', (event, args) => {
    connMessage.innerHTML = args;
    var btnSend = document.getElementById('btnSend');

    if(args=="Connected"){
        btnSend.style.opacity = 1;
        btnSend.disabled = false;
        connMessage.style.color = "green";
    }else{
        btnSend.style.opacity = 0.8;
        btnSend.disabled = true;
        connMessage.style.color = "crimson";
    }
});

ipc.on('responseMessage', (event, args) => {
    var response= JSON.parse(args);
    $('#textResponse').jsonPresenter({
        json: {response}, 
        
    });
});
