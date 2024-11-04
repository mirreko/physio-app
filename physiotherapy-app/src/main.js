import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import './style.css';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';


createApp(App)
  .use(store)
  .use(router) 
  .mount('#app');

