import { expose, transferHandlers } from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';
import store from './store.js';

transferHandlers.set('IGNORE_FUNCTIONS', {
  canHandle: (v) => v instanceof Function,
  serialize: (v) => [0, []],
  deserialize: () => 0,
});

expose(store);

// const logger = (...params) => console.log('FROM WORKER', ...params);

// self.addEventListener('message', (e) => {
//   if (e.data.topic === 'fetch') {
//     fetchCats(e.data.value);
//   }
// });

// function fetchCats(n) {
//   fetch(`https://api.thecatapi.com/v1/images/search?limit=${n}$&size=small`, {
//     headers: {
//       'x-api-key': '3fe716a0-1161-4025-a571-9312b7e89f3b',
//     }
//   }).then((response) => response.json())
//   .then((res) => {
//     const data = res.map((pic) => ({ id: pic.id, url: pic.url }));
//     self.postMessage(JSON.stringify(data));
//   });
// }
