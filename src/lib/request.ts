import axios from 'axios';

const BaseUrl = axios.create({
  baseURL: process.env.SERVE_CONSULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const GetRequest = async (url: string) => {
 return await BaseUrl.get(url)
    .then((response: any) => {
      return response.data;
    })
    .catch((err: any) => {
      return err;
    });
};

export const PostRequest = async (url: string, data: any) => {
  return await BaseUrl.post(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};

export const PutRequest = async (url: string, data: any) => {
  return await BaseUrl.put(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
