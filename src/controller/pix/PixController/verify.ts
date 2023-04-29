import 'dotenv/config';
import Gerencianet from 'gn-api-sdk-typescript';
import options from './create/credentials';
import { Request, Response } from 'express';
import { GetRequest, PutRequest } from '../../../lib/request';

export const VerifyPagamento = async (req: Request, res: Response) => {
  const Id = req.params.id;

  const urlGet = `/get/${Id}`;
  const dados = await GetRequest(urlGet);
  console.log('🚀 ~ file: verify.ts:12 ~ VerifyPagamento ~ dados:', dados);

  const params = {
    txid: dados.txid,
    // txid: 'dt9BHlyzrb5jrFNAdfEDVpHgiOmDbVqVxd',
  };

  const gerencianet = new Gerencianet(options);

  gerencianet
    .pixDetailCharge(params)
    .then(async (resposta: any) => {
      if(resposta.status === "CONCLUIDA"){
        const data = {
          ConclusionPixDate: resposta.pix[0].horario,
          estatos_pgto: 'Pago',
        };
        const url = `/save/${Id}`;
        const update = await PutRequest(url, data);
        console.log(update);

      }

      console.log(resposta);
    })
    .catch((error: Promise<any>) => {
      console.log(error);
    });
};
