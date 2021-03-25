const ipc = require('electron').ipcRenderer;

let replyDiv = document.querySelector('#state-con');


document.getElementById('btnConnect').addEventListener('click', function(e){
    ipc.sendSync('connect','ws://localhost:8082/web-socket    ');

});

document.getElementById('btnSend').addEventListener('click', function(e){
    ipc.send('send');
});


ipc.on('repuestaConn', (event, args) => {
    replyDiv.innerHTML = args;
});