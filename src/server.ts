import express, { json } from 'express';
import cors from 'cors'
import { PixRouter } from './router/pix';


const app = express();
app.use(json());
app.use(cors());
app.use(PixRouter);


app.listen(process.env.PORT || 3059, async function () {
 
  console.log('๐๐๐ค servidor em execuรงรฃo ๐ค๐๐')
  console.log(`๐๐๐ค ${process.env.SERVE_CONSULT} ๐ค๐๐`)
});

//payment.redebrasilrp.com.br