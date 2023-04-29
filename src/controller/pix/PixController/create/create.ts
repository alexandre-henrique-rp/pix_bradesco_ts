import 'dotenv/config';
import { Request, Response } from 'express';
import Gerencianet from 'gn-api-sdk-typescript';
import options from './credentials';
import Txid from './txid';
import { GetRequest, PutRequest } from '../../../../lib/request';

export const CreatePg = async (req: Request, res: Response) => {
  const Id = req.params.id;
  const urlGet = `/get/${Id}`;
  const dados = await GetRequest(urlGet);

  const body = {
    calendario: {
      expiracao: 3600,
    },
    devedor: {
      cpf: dados.cpf,
      nome: dados.nome,
    },
    valor: {
      original: dados.valorcd.replace(',', '.'),
    },
    chave: process.env.CHAVE_PIX, // Informe sua chave Pix cadastrada na gerencianet	
  };

  const params = {
    txid: Txid(),
  };

  const gerencianet = new Gerencianet(options);

  gerencianet
    .pixCreateCharge(params, body)
    .then(async(resposta: any) => {
        const data = {
          txid: resposta.txid,
          qrcodeLink: resposta.location,
          CreatePixDate: resposta.calendario.criacao,
        }
        const url = `/save/${Id}`;
       const update =  await PutRequest(url, data);
       console.log(update)
      
      res.status(200).json(resposta);
    })
    .catch((error: Promise<any>) => {
      res.status(400).json(error);
    });
};
