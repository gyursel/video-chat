const peer = new Peer(); // Създаваме нова връзка
let localStream;

// 1. Показваме твоето ID, когато се генерира
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// 2. Пускаме твоята камера
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    localStream = stream;
    document.getElementById('local-video').srcObject = stream;
});

// 3. Когато някой ти звънне - отговори
peer.on('call', (call) => {
    call.answer(localStream); // Изпрати твоето видео
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

// 4. Когато ти звъннеш на някого
document.getElementById('call-btn').addEventListener('click', () => {
    const remoteId = document.getElementById('remote-id').value;
    const call = peer.call(remoteId, localStream);
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});