require('dotenv/config');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const Conection = async () => {
  const url = process.env.PAYMENT_URL_TEST + '/oauth/token';
  const string = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET;
  // const emBase64 = Buffer.from(string).toString('base64');
  const emBase64 = Buffer.from(string, 'base64');
  // const emBase64 = btoa(clientID + ":" + clientSecret);
  // console.log(emBase64);

  // Lê o arquivo .pfx
  const pfx = fs.readFileSync(
    'src/certificate/REDE BRASIL RP SERVICOS ADMINISTRATIVOS EIRELI14000930000150.pfx',
  );

  // Cria um contexto seguro usando o arquivo .pfx e a senha
  const httpsAgent = new https.Agent({
    hostname: 'https://qrpix-h.bradesco.com.br',
    pfx: pfx,
    passphrase: process.env.PFXPASSWORD,
    securityOptions: 'SSL_OP_NO_SSLv3'
  });

  // Configuração da requisição
  const config = {
    httpsAgent,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Authorization: 'Basic ' + emBase64,
      Authorization:
        "Basic MjM2YWRiNDEtNTY3My00MWM5LWJmYzEtZmNjYjdlMDRlMGQzOmNiMTAxODE0LWNlZGMtNDk3Mi1hNDg0LTRlNWI4ZjlhZDE5Zg==",
    },
  };

  const data = {
    grant_type: 'client_credentials',
  };

  // Faz a requisição
  await axios
    .post('https://qrpix-h.bradesco.com.br/oauth/token',data, config)
    .then((response) => {
      console.log(response.data);
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

Conection();

