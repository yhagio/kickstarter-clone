import express from 'express';
const app = express();
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';

import expressConfig from './express-config';
expressConfig(app);

import routes from './routes';
routes(app);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
