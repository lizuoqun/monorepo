import { createApp, ref } from 'vue';
import App from './App.vue';
import router from './router.ts';

const state = ref(0);

const random = () => {
  return Math.random().toString(36).substr(2);
};

console.log('1 =====', random());
console.log('2 =====', random());
console.log('state =====', state.value);

export { state, random };

const app = createApp(App);
app.use(router);
app.mount('#app');
