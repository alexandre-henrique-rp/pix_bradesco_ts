import express from 'express';
import PixController from '../controller/pix';

export const PixRouter = express.Router();

//pix
//------------------------------------------------------------------------------

PixRouter.post('/create/payment/:id', PixController.CreatePg);
PixRouter.get('/check/payment/:id', PixController.VerifyPagamento);
PixRouter.put('/save/:id', PixController.DataSave);
PixRouter.get('/get/:id', PixController.Get);


// id 21169