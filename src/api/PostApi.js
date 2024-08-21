import { MakeRequest } from '../plugins/RequestPlugin';

const MAP = {
  attachments: '/attachments'
};
const route = '/post';

export async function getById(id) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + `/${id}`
  });

  return res;
}

export async function create(postObject) {
  const res = await MakeRequest({
    method: 'Post',
    path: route,
    data: { ...postObject }
  });

  return res;
}

export async function preview(postObject) {
  const res = await MakeRequest({
    method: 'Post',
    path: route + `/test`,
    data: { ...postObject }
  });

  return res;
}

export async function deleteById(id) {
  const res = await MakeRequest({
    method: 'Delete',
    path: route + `/${id}`
  });

  return res;
}

export async function getByTimeRange(fromDate, toDate, organizationId) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + `?fromDate=${fromDate}&toDate=${toDate}&organizationId=${organizationId}`
  });

  return res;
}

export async function uploadAttachment(base64, orgId) {
  const res = await MakeRequest({
    method: 'Post',
    path: route + MAP.attachments,
    data: { attachmentsBody: base64, organizationId: orgId }
  });

  return res;
}

export async function getAttachment(id) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + MAP.attachments + `?id=${id}`
  });

  return res;
}

export async function editPost(id, postObject) {
  const res = await MakeRequest({
    method: 'Patch',
    path: route + `/${id}`,
    data: postObject
  });

  return res;
}
