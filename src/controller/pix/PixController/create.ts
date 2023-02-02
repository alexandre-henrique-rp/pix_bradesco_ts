import 'dotenv/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import https from 'https';
import { Request, Response } from 'express';
import { Conection } from '../../../lib/conection';

export const PgPagamento = async (req: Request, res: Response) => {
  const info = req.body;
  const url = process.env.PAYMENT_URL_TEST + '/oauth/token';

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const dia = currentDate.getDate();
  const mes =
    currentDate.getMonth() + 1 > 10
      ? currentDate.getMonth() + 1
      : 0 + (currentDate.getMonth() + 1);
  const ano = currentDate.getFullYear();
  const referencia = `${dia}-${mes}-${ano}.${hours}:${minutes}:${seconds}`;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + dia + mes + ano;

  function generateEncryptedPassword(base: number): string {
    let encryptedPassword = base.toString();
    while (encryptedPassword.length < 30) {
      encryptedPassword = (base + encryptedPassword).toString();
    }
    encryptedPassword = encryptedPassword.slice(0, 38);
    return encryptedPassword;
  }

  const txid = generateEncryptedPassword(info.cpf + totalSeconds);


  // converter para base64
  const string = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET;
  const emBase64 = Buffer.from(string).toString('base64');

  // Lê o arquivo .pfx
  const pfx = fs.readFileSync(
    'src/certificate/REDE BRASIL RP SERVICOS ADMINISTRATIVOS EIRELI14000930000150.pfx',
  );

  //senha
  const passphrase = process.env.PFXPASSWORD;

  // Cria um contexto seguro usando o arquivo .pfx e a senha
  const httpsAgent = new https.Agent({
    pfx,
    passphrase,
    secureOptions: crypto.constants.SSL_OP_NO_SSLv3,
  });

  const config: AxiosRequestConfig = {
    httpsAgent,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + emBase64,
    },
  };

  const axiosInstance: AxiosInstance = axios.create(config);

  // dados da requisição post
  const data = {
    grant_type: 'client_credentials',
  };

  // fazendo a requisição post com axios
  await axiosInstance
    .post(url, data)
    .then(async (response: any) => {
      const resp = await response.data.access_token;
      const url2 = process.env.PAYMENT_URL_TEST + '/v2/cob/' + txid;
      const chave = process.env.CHAVE_PIX;
      const valor = info.valor.replace(',', '.');


      // Lê o arquivo .pfx
      const pfx = fs.readFileSync(
        'src/certificate/REDE BRASIL RP SERVICOS ADMINISTRATIVOS EIRELI14000930000150.pfx',
      );

      //senha
      const passphrase = process.env.PFXPASSWORD;

      // Cria um contexto seguro usando o arquivo .pfx e a senha
      const httpsAgent = new https.Agent({
        pfx,
        passphrase,
        secureOptions: crypto.constants.SSL_OP_NO_SSLv3,
      });

      const config2: AxiosRequestConfig = {
        httpsAgent,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie:
            '4a89a5738b56aac1f65a99f1bc32a7c2=d4e21859dddadf77952b02d57ca7990d; dtCookie=v_4_srv_10_sn_9DB8F82E7329DEF0054EAFBC14213C8F_perc_100000_ol_0_mul_1_app-3Aea7c4b59f27d43eb_1',
          Authorization: 'Bearer ' + resp,
        },
      };

      const axiosInstance2: AxiosInstance = axios.create(config2);

      const dataPix = {
        calendario: {
          expiracao: 3600,
        },
        devedor: {
          cpf: info.cpf,
          nome: info.nome,
        },
        valor: {
          original: valor,
        },
        chave: chave,
        solicitacaoPagador: `Venda de certificado cliente id: ${info.id}.`,
      };
      await axiosInstance2
        .put(url2, dataPix)
        .then(async (response: any) => {
          const Id = info.id;

          const hist = info.historico;

          const atividade = `${hist}${referencia}-${info.agr}: Gerou o pagamento via Pix\n`;

          const dados: any = {
            txid: txid,
            qrcodeLink: response.data.pixCopiaECola,
            CreatePixDate: response.data.calendario.criacao,
            historico: atividade,
          };

          await Conection(dados, Id);

          res.status(200).json(response.data);
        })
        .catch((err: any) => {
          console.error(err);
          res
            .status(400)
            .send({ msg: 'Não foi possível criar pagamento via PIX', err });
        });
    })
    .catch((error: any) => {
      console.error(error);
      res
        .status(400)
        .send({ msg: 'Não foi possível criar pagamento via PIX', error });
    });
};
