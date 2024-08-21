import { MakeRequest } from '../plugins/RequestPlugin';

const route = '/organization';

export async function create(name, description) {
  const res = await MakeRequest({
    method: 'Post',
    path: route,
    data: { name, description }
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

export async function deleteById(id) {
  const res = await MakeRequest({
    method: 'Delete',
    path: route + `/${id}`
  });

  return res;
}

export async function deleteMember(organizationId, username) {
  const res = await MakeRequest({
    method: 'Delete',
    path: route + `/${organizationId}/members/${username}`
  });

  return res;
}

export async function getIntegrations(id) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + `/${id}/integrations`
  });

  return res;
}

export async function addMember(id, username) {
  const res = await MakeRequest({
    method: 'Put',
    path: route + `/${id}/members`,
    data: { username, role: 'MEMBER' }
  });

  return res;
}

export async function getMembers(id) {
  const res = await MakeRequest({
    method: 'Get',
    path: route + `/${id}/members`
  });

  return res;
}

export async function getAddIntegrationLink(organizationId, type) {
  const res = await MakeRequest({
    method: 'POST',
    path: route + `/${organizationId}/integrations/${type}/add-link`
  });

  return res;
}

export async function changeMemberRole(id, username, role) {
  const res = await MakeRequest({
    method: 'Patch',
    path: route + `/${id}/members/${username}`,
    data: { role }
  });

  return res;
}
