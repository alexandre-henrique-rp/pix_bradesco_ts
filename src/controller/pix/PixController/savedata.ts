import { Request, Response } from 'express';
import { Fcweb } from '../../../db/table/fcweb';


export const DataSave = async (req: Request, res: Response) => {
  var dados = req.body;
  await Fcweb.update(dados, {
    where: {
      id: req.params.id,
    },
  })
    .then((resp: any) => {
      return res.status(201).json({
        message: 'Dados do pix salvos com sucesso!',
        data: resp.data
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        message: 'Erro: Não foi possível atualizar os dados de pagamento!',
        data: err.original
      });
    });
};

// txid: txid,
// qrcodeLink: response.data.pixCopiaECola,
// CreatePixDate: response.data.calendario.criacao,
// ConclusionPixDate: DataTypes.DATE,
