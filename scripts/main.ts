const random = () => {
  return Math.random().toString(36).substr(2);
};

console.log('1 =====', random());
console.log('2 =====', random());
