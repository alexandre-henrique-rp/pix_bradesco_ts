import express from 'express';
import PixController from '../controller/pix';

export const PixRouter = express.Router();

//pix
//------------------------------------------------------------------------------

PixRouter.post('/create/payment', PixController.PgPagamento)
PixRouter.post('/check/payment/:id', PixController.VerifyPagamento)
