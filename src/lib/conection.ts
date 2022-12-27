import axios from "axios";


export const Conection = async () => {
    const url = '/auth/server/oauth/token';
  const string = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET;
  const emBase64 = Buffer.from(string).toString('base64');
  console.log(emBase64);

    return'conectou'

    await axios({
        method: "POST",
        url: process.env.PAYMENT_URL_TEST + url,
        // url: process.env.PAYMENT_URL + url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic' + emBase64
        },
        data: {
            'grant_type': process.env.CLIENT_CREDENTIALS,
            'scope': ""
        }
    })
        .then((response: object) => {
            console.log(response);
            return response;
        })
        .catch((error: any) => {
            console.log(error);
            return error;
        })
}