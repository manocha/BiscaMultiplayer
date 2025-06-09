import io from 'socket.io-client';

const hostname = window.location.hostname;
const port = process.env.PORT || 8000;

// For running locally:
const socket = io.connect(`http://${hostname}:${port}`);
// For running on cloud (Heroku, Render, etc.):
// const socket = io.connect(`https://${hostname}`);

export default socket;
