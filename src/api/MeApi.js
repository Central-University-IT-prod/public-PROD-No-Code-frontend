import { MakeRequest } from '../plugins/RequestPlugin';

const route = '/user/me';

export async function getMe() {
  const res = await MakeRequest({
    method: 'Get',
    path: route
  });

  return res;
}

export async function getOrganizations() {
  const res = await MakeRequest({
    method: 'Get',
    path: route + '/organizations'
  });
  return res;
}
