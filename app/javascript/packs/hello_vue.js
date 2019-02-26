/* eslint no-console: 0 */
import TurbolinksAdapter from 'vue-turbolinks';
import Vue from 'vue';
import App from '../app.vue';

Vue.use(TurbolinksAdapter);

document.addEventListener('turbolinks:load', () => {
  const el = document.getElementById('vue');

  if (el != null) {
    const app = new Vue({
      el,
      render: h => h(App)
    });
  }
});
