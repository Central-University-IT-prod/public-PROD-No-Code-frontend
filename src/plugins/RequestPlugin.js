import axios from 'axios';
import Cookies from 'js-cookie';

const API = import.meta.env.VITE_API;

const UpdateAccess = async () => {
  const refreshToken = Cookies.get('refreshToken');

  const headers = {
    Authorization: 'Bearer ' + refreshToken
  };

  return await axios
    .post(
      API + '/auth/refresh-token',
      {},
      {
        headers
      }
    )
    .then((res) => {
      const { refreshToken, accessToken } = res.data.data;

      Cookies.set('refreshToken', refreshToken);
      Cookies.set('accessToken', accessToken);
    })
    .catch((e) => {
      Cookies.remove('refreshToken');
    });
};

export const MakeRequest = async (param) => {
  const headers = param?.headers ?? {};

  let accessToken = Cookies.get('accessToken');
  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken;
  }

  const verdict = {
    ok: true,
    data: null,
    error: null
  };

  let refresh = false;

  await axios
    .request({
      url: API + param?.path,
      headers,
      method: param?.method ?? 'Get',
      data: param?.data
    })
    .then((res) => {
      verdict.data = res.data.data;
      verdict.ok = true;
    })
    .catch((e) => {
      verdict.ok = false;
      if (!e.response) {
        verdict.error = {
          type: 'Ошибка сервера',
          data: 'Сервер временно недоступен, попробуйте позже'
        };
      } else {
        const status = e.response.status;
        if (status === 401) {
          Cookies.remove('accessToken');

          if (Cookies.get('refreshToken')) {
            refresh = true;
          }
        }

        verdict.error = e?.response?.data;
      }
    });

  if (refresh) {
    await UpdateAccess();

    accessToken = Cookies.get('accessToken');
    if (accessToken) {
      headers.Authorization = 'Bearer ' + accessToken;

      await axios
        .request({
          url: API + param?.path,
          headers,
          method: param?.method ?? 'Get',
          data: param?.data
        })
        .then((res) => {
          verdict.data = res.data.data;
          verdict.ok = true;
        })
        .catch((e) => {
          verdict.ok = false;
          verdict.error = e?.response?.data;
        });
    }
  }

  return verdict;
};
