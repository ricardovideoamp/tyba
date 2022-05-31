#!/usr/bin/env node

import http from 'http';
import app from '../app';

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

const onListening = () => {
  console.log(`Listening on ${port}`);
};

server.listen(port);
server.on('listening', onListening);
