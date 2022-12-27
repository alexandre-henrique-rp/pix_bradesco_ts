import axios from 'axios';

export const CreatPgPix = async (token: any, data: any) => {
  const url = ' / cob/' + data.id;

 console.log(token);
  return{
    "status": "ATIVA",
    "calendario": {
    "criacao": "2020-09-09T20:15:00.358Z",
    "expiracao": "3600"
    },
    "location": "https://www.youtube.com/watch?v=09R8_2nJtjg&?autoplay=1",
    "txid": "7978c0c9-7ea8-47e7-8e88-49634473c1f1",
    "revisao": 1,
    "devedor": {
    "cpf": "12345678909",
    "nome": "Francisco da Silva"
    },
    "valor": {
    "original": "123.45"
    },
    "chave": "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
    "solicitacaoPagador": "Cobrança dos serviços prestados."
    }

  await axios({
    method: 'POST',
    url: process.env.PAYMENT_URL_TEST + url,
    // url: process.env.PAYMENT_URL + url,
    headers: {
      Authorization: token,
    },
    data: {
      calendario: {
        expiracao: '3600',
      },
      devedor: {
        cpf: data.cpf,
        nome: data.nome,
      },
      valor: {
        // "original": "123.45"
        original: data.valor,
      },
      chave: process.env.CHAVES_PIX,
      solicitacaoPagador: `Cobrança refenrente apagamento do cetificado digital medelo ${data.certificado} feito no dia ${data.dia}.`,
    },
  })
    .then((response: object) => {
      console.log(response);
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error;
    });
};
