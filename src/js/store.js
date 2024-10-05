import unistore from 'https://unpkg.com/unistore@3.5.2/dist/unistore.es.js';

const initialState = {
  urls: [],
  from: 'urls',
  running: false,
  results: null,
  leaderboardLoaded: false,
  leaderboardError: false,
  filters: {
    device: 'PHONE',
  }
};

function leaderboard(state = {}, action) {
  const newState = { ...state };

  switch (action.type) {
    case 'LEADERBOARD_UPDATE':
      newState.running = true;

      if (action.urls) {
        newState.urls = action.urls;
      }
      if (action.from) {
        newState.from = action.from;
      }
      return newState;

    case 'LEADERBOARD_LOADED':
      newState.running = false;
      newState.leaderboardLoaded = true;
      newState.results = action.results || null;
      newState.leaderboardError = action.error || false;
      return newState;

    case 'CHANGE_DEVICE':
      newState.running = true;
      newState.results = null;
      newState.filters.device = action.value;
      return newState;

    case 'CHANGE_FROM':
      return {
        ...initialState,
        from: action.value,
      };

    case 'ADD_URL':
      const value = Array.isArray(action.value) ? action.value : [action.value];
      newState.urls = [...state.urls, ...value];
      newState.running = false;
      newState.results = null;
      newState.leaderboardLoaded = false;
      return newState;

    case 'REMOVE_URL':
      newState.urls = state.urls.filter(url => url !== action.value);
      newState.running = false;
      newState.results = null;
      newState.leaderboardLoaded = false;
      return newState;

    case 'RESET':
      return initialState;

    default:
      return newState;
  }
}

const store = unistore(initialState);

// Create a dispatch method like Redux
store.dispatch = store.action(leaderboard);

export default store;
