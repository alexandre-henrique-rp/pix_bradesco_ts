import { Request, Response } from 'express';
import { Conection } from '../../../lib/conection';
import { CreatPgPix } from '../../../lib/creatPgPix';

export const PgPagamento = async (req: Request, res: Response) => {
  try {
    const data = req.body
    const token = await Conection(data)

    // const pix = await CreatPgPix(token, data)
    // res.status(200).json(pix);
  } catch (error) {
    res.status(400).send("Não foi possível criar pagamento via PIX");
  }
};
