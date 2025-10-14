import { ref } from 'vue';

const state = ref(0);

const random = () => {
  return Math.random().toString(36).substr(2);
};

console.log('1 =====', random());
console.log('2 =====', random());
console.log('state =====', state.value);

export { state, random };
