import { MakeRequest } from '../plugins/RequestPlugin';

const route = '/auth'

const MAP = {
  SignIn: "/sign-in",
  Register: "/register",
}

/**
 * POST endpoint для входа по password
 * @param {String} username 
 * @param {String} password 
 */
export async function SignIn(username, password) {
  const path = route + MAP.SignIn;

  const data = {
    username,
    password
  }

  return await MakeRequest({
    method: "Post",
    path,
    data
  });
}

/**
 * POST endpoint для входа по password
 * @param {String} username 
 * @param {String} password 
 * @param {String} fullName
*/
export async function Register(username, password, fullName) {
  const path = route + MAP.Register;

  const data = {
    username,
    fullName,
    password
  }

  return await MakeRequest({
    method: "Post",
    path,
    data
  })
}
