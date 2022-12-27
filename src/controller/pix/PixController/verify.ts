import { Request, Response } from 'express';
import { Conection } from '../../../lib/conection';
import { ConsultPgPix } from '../../../lib/consultPgPix';


export const VerifyPagamento = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const token = await Conection()
    const pix = await ConsultPgPix(token, id)
    res.status(200).json(pix);
  } catch (error) {
    res.status(400).send("Não foi possível criar pagamento via PIX");
  }
};