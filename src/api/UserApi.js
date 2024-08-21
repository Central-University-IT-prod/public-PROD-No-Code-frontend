import { MakeRequest } from '../plugins/RequestPlugin';

const route = '/user';
const MAP = {
  search: '/search?query='
};
export async function search(username) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + MAP.search + username
  });

  return res;
}

export async function getById(id) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + `/${id}`
  });

  return res;
}
