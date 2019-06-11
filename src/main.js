import Vue from 'vue'
import App from './App.vue'


new Vue({
  el: '#app',
  render: h => h(App)
});

let defaultValueLebel = document.getElementsById("default-label");
defaultValueLebel.style.display = 'block';
let wrongSizeLabel = document.getElementsByClassName("wrong-size-label");
wrongSizeLabel.style.display='none';
