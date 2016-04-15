import express from 'express';
const app = express();
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import Project from './models/project';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

mongoose.connect(process.env.MONGOLAB_URI, {}, (err)=> {
  if (err) {
    console.log('Connection Error to MongoDB hosted on MongoLab: \n', err);
  } else {
    console.log('Successfully Connected to MongoDB hosted on MongoLab');
  }
});

import expressConfig from './express-config';
expressConfig(app);

// ***** Mongoosastic (mongoose + Elasticsearch) setup *****

Project.createMapping((err, mapping) => {
  if (err) {
    console.log('*** Error creating mapping \n');
    console.log(err);
  } else {
    console.log('*** Mapping created \n');
    console.log(mapping);
  }
});

let stream = Project.synchronize();
let count = 0;

stream.on('data', () => {
  count++;
});

stream.on('close', () => {
  console.log('Indexed ' + count + ' documents');
});

stream.on('error', (err) => {
  console.log('Error occured: \n', err);
});



import routes from './routes';
routes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
