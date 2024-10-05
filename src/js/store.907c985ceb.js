import unistore from"https://unpkg.com/unistore@3.5.2/dist/unistore.es.js";const initialState={urls:[],from:"urls",running:!1,results:null,leaderboardLoaded:!1,leaderboardError:!1,filters:{device:"PHONE"}};function leaderboard(r={},e){const t={...r};switch(e.type){case"LEADERBOARD_UPDATE":return t.running=!0,e.urls&&(t.urls=e.urls),e.from&&(t.from=e.from),t;case"LEADERBOARD_LOADED":return t.running=!1,t.leaderboardLoaded=!0,t.results=e.results||null,t.leaderboardError=e.error||!1,t;case"CHANGE_DEVICE":return t.running=!0,t.results=null,t.filters.device=e.value,t;case"CHANGE_FROM":return{...initialState,from:e.value};case"ADD_URL":const s=Array.isArray(e.value)?e.value:[e.value];return t.urls=[...r.urls,...s],t.running=!1,t.results=null,t.leaderboardLoaded=!1,t;case"REMOVE_URL":return t.urls=r.urls.filter((r=>r!==e.value)),t.running=!1,t.results=null,t.leaderboardLoaded=!1,t;case"RESET":return initialState;default:return t}}const store=unistore(initialState);store.dispatch=store.action(leaderboard);export default store;