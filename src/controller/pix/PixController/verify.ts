import 'dotenv/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import https from 'https';
import { Request, Response } from 'express';

export const VerifyPagamento = async (req: Request, res: Response) => {
  const Id = req.params.id;
  console.log(Id);

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

  const url = process.env.PAYMENT_URL_TEST + '/oauth/token';

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
      const token = await response.data.access_token;

      const Cliente: any = await axios('http://localhost:3059/get/' + Id);

      const url2 =
        process.env.PAYMENT_URL_TEST + '/v2/cob/' + Cliente.data.txid;

      const config2: AxiosRequestConfig = {
        httpsAgent,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };

      const axiosInstance2: AxiosInstance = axios.create(config2);

      await axiosInstance2
        .get(url2)
        .then(async (response: any) => {
          console.log(response.data);
          const dados = response.data;
          const resp = response.data.status;
          const nome = response.data.devedor.nome;

          if (resp === 'ATIVA') {
            const hist = Cliente.data.historico;
            const Agr = req.body.agr;

            const atividade = `${hist}${referencia}-${Agr}: Verificou pagamento Pix\n`;

            const info = {
              historico: atividade,
            };

            await axios('http://localhost:3059/save/' + Id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              data: info,
            });

            res.status(200).json({
              msg: `Pagamento do cliente ${nome}, não foi Confirmado`,
              data: dados,
            });
          }
          if (resp === 'CONCLUIDA') {
            const hist = Cliente.data.historico;
            const Agr = req.body.agr;
            const Hpgto = response.data.pix[0].horario;

            const atividade = `${hist}${referencia}-${Agr}: Verificou pagamento Pix\n`;
            const atividade2 = `${hist}${referencia}-${Agr}: Confirmou pagamento Pix\n`;
            const ativG = atividade + atividade2;

            const info = {
              estatos_pgto: 'Pago',
              ConclusionPixDate: Hpgto,
              historico: ativG,
            };

            const atualizar = await axios('http://localhost:3059/save/' + Id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              data: info,
            });
            res.status(200).json({
              msg: `Pagamento do cliente ${nome}, Confirmado`,
              data: response.data,
              cover: atualizar,
            });
          } else {
            const hist = Cliente.data.historico;
            const Agr = req.body.agr;

            const atividade = `${hist}${referencia}-${Agr}: Pagamento Pix esta com erro, refazer cobrança\n`;

            const info = {
              historico: atividade,
            };

            const atualizar = await axios('http://localhost:3059/save/' + Id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              data: info,
            });

            res.status(200).json({
              msg: `Pagamento do cliente ${nome}, esta com erro gere outra`,
              data: response.data,
              cover: atualizar,
            });
          }
        })
        .catch((error: any) => {
          // console.error(error);
          // res
          //   .status(400)
          //   .send({ msg: 'Não foi possível verificar o pagamento PIX', error });
        });
    })
    .catch((error: any) => {
      console.error(error);
      res
        .status(400)
        .send({ msg: 'Não foi possível verificar o pagamento PIX', error });
    });
};
