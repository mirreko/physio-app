import { createRouter, createWebHistory } from 'vue-router';
import PhysioDashboard from '../pages/PhysioDashboard.vue'; 
import PatientDashboard from '../pages/PatientDashboard.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue'; 
import ExerciseDetail from '../components/physio/ExerciseDetail.vue';
import Trainingplans from '../pages/Trainingplans.vue';
import ExerciseList from '../components/physio/ExerciseList.vue';
import BadgeOverview from '../pages/BadgeOverview.vue';
import Statistics from '../pages/Statistics.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' // Weiterleitung von / auf /login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: '/physio-dashboard',
    name: 'PhysioDashboard',
    component: PhysioDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/patient-dashboard',
    name: 'PatientDashboard',
    component: PatientDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/physio-dashboard/exercises',
    name: 'ExerciseList',
    component: ExerciseList
  },
  {
    path: '/physio-dashboard/exercise/:id',
    name: 'ExerciseDetail',
    component: ExerciseDetail,
    props: true
  },
  {
    path: '/trainingplans', 
    name: 'Trainingplans',
    component: Trainingplans,
    meta: { requiresAuth: true }, // Diese Route benötigt Authentifizierung
  },
  {
    path: '/badges',
    name: 'BadgeOverview',
    component: BadgeOverview,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
