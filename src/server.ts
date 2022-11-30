import express, { json } from 'express';
import cors from 'cors'


const app = express();
app.use(json());
app.use(cors());


app.listen(process.env.PORT || 3055, async function () {
 
  console.log('🚀🚀🤖 servidor em execução 🤖🚀🚀')
  console.log(`🚀🚀🤖 ${process.env.SERVE_CONSULT} 🤖🚀🚀`)
});
