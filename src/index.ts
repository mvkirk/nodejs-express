import { UsersController } from './controller/users.controller';
import { AuthController } from './controller/auth.controller';
import { PostsController } from './controller/posts.controller';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

import loaders from './loaders';

async function startServer() {
  // Récupération de l'application initiale
  const app = express();

  // Certificate
  const privateKey = fs.readFileSync('../key.pem', 'utf8');
  const certificate = fs.readFileSync('../cert.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
  };
  
  // Chargement des différent loader
  await loaders(app);
  
  // Ajout des différentes route de votre application
  AuthController(app);
  PostsController(app);
  UsersController(app);

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);
  
  // Démarrage du serveur une fois que tout est correctement init
  httpsServer.listen(443, () => console.log('HTTPS Express server  is running'));
  httpServer.listen(80, () => console.log('HTTP Express server  is running'));
}

startServer();
