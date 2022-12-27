import express, { json } from 'express';
import cors from 'cors'
import { PixRouter } from './router/pix';


const app = express();
app.use(json());
app.use(cors());
app.use(PixRouter);


app.listen(process.env.PORT || 3059, async function () {
 
  console.log('🚀🚀🤖 servidor em execução 🤖🚀🚀')
  console.log(`🚀🚀🤖 ${process.env.SERVE_CONSULT} 🤖🚀🚀`)
});

//payment.redebrasilrp.com.br