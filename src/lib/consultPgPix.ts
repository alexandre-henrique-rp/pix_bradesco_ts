import axios from 'axios';

export const ConsultPgPix = async (token: any, id: number) => {
  const url = ' / cob/' + id;

  await axios({
    method: 'POST',
    url: process.env.PAYMENT_URL_TEST + url,
    // url: process.env.PAYMENT_URL + url,
    headers: {
      Authorization: token,
    }
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
