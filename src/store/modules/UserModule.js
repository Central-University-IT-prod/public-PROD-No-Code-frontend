import Cookies from 'js-cookie';
import { getMe } from '../../api/MeApi';

export default {
  namespaced: true,

  state: {
    User: null
  },

  mutations: {
    assignUser(state, User) {
      state.User = User;
    }
  },

  actions: {
    async initUserByToken(context) {
      const verdict = await getMe();
      if (verdict.ok) {
        context.commit('assignUser', verdict.data);
      }
    },

    async initUserAfterLogin(context, data) {
      const { accessToken, refreshToken } = data;

      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      const res = await getMe();

      if (res.ok) {
        context.commit('assignUser', res.data);
      }
    }
  }
};
