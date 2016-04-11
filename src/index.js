import express from 'express';
const app = express();
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

mongoose.connect(process.env.MONGOLAB_URI /* || mongoConfig.db */, {}, (err)=> {
  if (err) {
    console.log('Connection Error: ', err);
  } else {
    console.log('Successfully Connected');
  }
});

import expressConfig from './express-config';
expressConfig(app);

import routes from './routes';
routes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
