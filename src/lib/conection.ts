import axios from 'axios';

export const Conection = async (info: any, id: number) => {
  console.log(info);
  console.log(id);
  const config = {
    method: 'PUT',
    url: 'http://localhost:3059/save/' + id,
    headers: {
      'Content-Type': 'application/json',
    },
    data: info,
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      // console.log(error);
    });
};
