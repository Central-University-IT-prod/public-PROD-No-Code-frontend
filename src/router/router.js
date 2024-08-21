import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import OrganizationView from '../views/OrganizationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Календарь',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'Аунтефикация',
      component: AuthView
    },
    {
      path: '/createPost',
      name: 'СоздатьПост',
      component: CreatePostView
    },
    {
      path: '/organization',
      name: 'Организации',
      component: OrganizationView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ]
});

// Список роутов, которые будут отображаться в хедере
export const navRoutes = [
  {
    path: '/',
    name: 'Календарь'
  },
  {
    path: '/createPost/',
    name: 'Пост'
  },
  {
    path: '/organization/',
    name: 'Организации'
  }
];

export default router;
