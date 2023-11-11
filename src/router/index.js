import { createRouter, createWebHistory } from 'vue-router';
import ScheduleView from '../views/ScheduleView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ScheduleView,
    },
  ],
});

export default router;
