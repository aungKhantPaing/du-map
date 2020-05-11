import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/registerServiceWorker';
import vuetify from './plugins/vuetify';
import VueMeta from 'vue-meta';

Vue.use(VueMeta);
Vue.config.productionTip = false;

//* If your PWA meets the required installation criteria(https://web.dev/install-criteria/),
//* the browser fires a 'beforeinstallprompt'
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  store.dispatch('setDeferredPrompt', e);
  // Update UI notify the user they can install the PWA
  store.dispatch('showInstall');
  // eslint-disable-next-line no-console
  console.log(e);
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
