import Vue from 'vue';
import App from './views/App.vue';

// Vue.component('Page', Page);
// Vue.component('ActionBar', ActionBar);
// Vue.component('GridLayout', GridLayout);
// Vue.component('Button', Button);
// Vue.component('Img', Img);
// Vue.component('Label', Label);

new Vue({
	render: (h) => h(App),
}).$mount('#app');
