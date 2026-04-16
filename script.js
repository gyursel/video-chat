const peer = new Peer();
let localStream;

const localVideo = document.getElementById('localVideo'); // от твоя нов HTML
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startBtn');
const callBtn = document.getElementById('nextBtn'); // Използваме Next за обаждане
const statusDisplay = document.getElementById('status');
const myIdDisplay = document.getElementById('sideStatus');

// 1. Стартиране на камерата при натискане на Start
startBtn.addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        statusDisplay.innerText = "Camera Active";
        startBtn.disabled = true;
        callBtn.disabled = false;
        document.getElementById('stopBtn').disabled = false;
    } catch (err) {
        console.error("Грешка с камерата:", err);
        alert("Моля, разрешете достъп до камерата.");
    }
});

// 2. Генериране на ID
peer.on('open', (id) => {
    myIdDisplay.innerText = "Your ID: " + id;
    console.log("My peer ID is: " + id);
});

// 3. Приемане на обаждане
peer.on('call', (call) => {
    call.answer(localStream);
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
        statusDisplay.innerText = "Connected!";
    });
});

// 4. Функцията за бутона Next (Обаждане)
callBtn.addEventListener('click', () => {
    const remoteId = prompt("Въведи ID на партньора:");
    if (remoteId) {
        const call = peer.call(remoteId, localStream);
        statusDisplay.innerText = "Calling...";
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
            statusDisplay.innerText = "Connected!";
        });
    }
});