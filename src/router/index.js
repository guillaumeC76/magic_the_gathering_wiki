// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CardDetails from '@/views/CardDetails.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/card/:id',
    name: 'CardDetails',
    component: CardDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
