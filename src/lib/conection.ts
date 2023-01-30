import 'dotenv/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import https from 'https';
import { CreatPgPix } from './creatPgPix';

export const Conection = async (info: any) => {
  const url = process.env.PAYMENT_URL_TEST + '/oauth/token';

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const dia = currentDate.getDate();
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + dia + mes + ano;
  console.log(totalSeconds);

  function generateEncryptedPassword(base: number): string {
    let encryptedPassword = base.toString();
    while (encryptedPassword.length < 30) {
      encryptedPassword = (base + encryptedPassword).toString();
    }
    encryptedPassword = encryptedPassword.slice(0, 38);
    return encryptedPassword;
  }

  const txid = generateEncryptedPassword(info.cpf + totalSeconds);
  console.log(txid);
  console.log(txid.length);

  // const url2 = process.env.PAYMENT_URL_TEST + '/ cob/'+ txid;
  const string = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET;
  // const emBase64 = Buffer.from(string, 'base64');
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
    .then(async (response) => {
      const resp = await response.data.access_token;
      console.log(info);
      console.log(resp);
      // await axiosInstance
      //   .post(url2, data)
      //   .then(async (response) => {
      //     const resp = await response.data.access_token;
      //     const pix = await CreatPgPix(resp, info);
      //     return pix;
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     return error;
      //   });
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
};
