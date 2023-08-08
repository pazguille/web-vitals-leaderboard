import unistore from"https://unpkg.com/unistore@3.5.2/dist/unistore.es.js";const initialState={urls:[],from:"urls",running:!1,results:null,leaderboardLoaded:!1,leaderboardError:!1,filters:{device:"PHONE",connection:"4G"}};function leaderboard(r={},e){const n={...r};switch(e.type){case"LEADERBOARD_UPDATE":return n.running=!0,e.urls&&(n.urls=e.urls),e.from&&(n.from=e.from),n;case"LEADERBOARD_LOADED":return n.running=!1,n.leaderboardLoaded=!0,n.results=e.results||null,n.leaderboardError=e.error||!1,n;case"CHANGE_DEVICE":return n.running=!0,n.results=null,n.filters.device=e.value,n;case"CHANGE_CONNECTION":return n.running=!0,n.results=null,n.filters.connection=e.value,n;case"CHANGE_FROM":return{...initialState,from:e.value};case"ADD_URL":const t=Array.isArray(e.value)?e.value:[e.value];return n.urls=[...r.urls,...t],n.running=!1,n.results=null,n.leaderboardLoaded=!1,n;case"REMOVE_URL":return n.urls=r.urls.filter((r=>r!==e.value)),n.running=!1,n.results=null,n.leaderboardLoaded=!1,n;case"RESET":return initialState;default:return n}}const store=unistore(initialState);store.dispatch=store.action(leaderboard);export default store;