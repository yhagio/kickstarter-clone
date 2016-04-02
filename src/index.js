import express from 'express';
const app = express();
import morgan from 'morgan';
import helmet from 'helmet';

app.use(morgan('combined'));
app.use(helmet());

app.route('/')
  .get((req, res) => {
    res.send({'greet':'Hello'});
  })
  .post((req, res) => {
    console.log(req.body);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
