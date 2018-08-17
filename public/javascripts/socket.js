const socket = io();

const addChatItem = (text) => {
  const chatMessage = document.getElementById('chatMessage');

  const li = document.createElement('li');
  li.innerText = text;

  chatMessage.appendChild(li);
};

function sendMessage() {
  const chatForm = document.forms['chatForm'];
  const elements = chatForm.elements;

  const message = elements.chatText.value;
  elements.chatText.value = '';

  socket.emit('message', message, (data) => {
    addChatItem(data);
  });
}

socket.on('message', (username, text) => {
  addChatItem(`${username} > ${text}`);

  socket.emit('my other event', { my: 'data' });
});

socket.on('join', (username) => {
  addChatItem(`${username} is connect`);
});

socket.on('leave', (username) => {
  addChatItem(`${username} is disconnect`);
});
