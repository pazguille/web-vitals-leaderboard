import store from"./store.ee6177fdcf.js";export default class Loading{constructor(){this.$node=document.querySelector("#loading")}toggleVisibility(){const{running:t,leaderboardLoaded:e}=store.getState();t?this.$node.removeAttribute("hidden"):e&&this.$node.setAttribute("hidden","hidden")}init(){store.subscribe(this.toggleVisibility.bind(this))}}