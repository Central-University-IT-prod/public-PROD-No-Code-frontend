import { MakeRequest } from '../plugins/RequestPlugin';
const route = '/post';
export async function getData(postId) {
  const path = route + `/${postId}/statistics`;

  return await MakeRequest({
    method: 'get',
    path
  });
}
