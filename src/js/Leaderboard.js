import store from './store.js';
import { resultTemplate, skeletonTemplate } from './templates.js';

export default class LeaderboardResults {
  constructor() {
    this.$node = document.querySelector('table');
    this.$results = document.querySelector('#content');
  }

  sortBy(metric) {
    return (a, b) => {
      if ( a.metrics === null) {
        return 1;
      }
      if (b.metrics === null) {
        return -1;
      }
      if (a.metrics[metric].value < b.metrics[metric].value) {
        return -1;
      }
      if (a.metrics[metric].value > b.metrics[metric].value) {
        return 1;
      }
      return 0;
    }
  }

  fetchData(data) {
    if (data.urls) {
      data.urls = data.urls.map((url) => encodeURIComponent(url)).join(',');
    } else if (data.origins) {
      data.origins = data.origins.map((url) => encodeURIComponent(url)).join(',');
    }
    const query = Object.keys(data).map(key => key + '=' + data[key]).join('&');
    return fetch(`https://crux.pazguille.me/api/web-vitals?${query}`)
      .then(res => res.json())
      .then((results) => {
        if (results.code) {
          store.dispatch({ type: 'LEADERBOARD_LOADED', error: true });
          return;
        }
        store.dispatch({ type: 'LEADERBOARD_LOADED', results });
      })
      .catch(() => {
        store.dispatch({ type: 'LEADERBOARD_LOADED', error: true });
      })
  }

  toggleVisibility() {
    const { running, from, urls, filters, leaderboardLoaded, results } = store.getState();

    if (running) {
      this.fetchData({
        [from]: urls,
        device: filters.device,
      });
      this.$node.setAttribute('hidden', 'hidden');
      return;
    }

    if (leaderboardLoaded && results) {
      const html = results
        .sort(this.sortBy('LCP'))
        .map((result, index) => resultTemplate(result, index+=1));
      this.$node.removeAttribute('hidden');
      this.$results.innerHTML = '';
      this.$results.insertAdjacentHTML('beforeend', html.join(''));
      this.$node.removeAttribute('hidden');
      return;
    }

    if (leaderboardLoaded === false && urls.length > 0) {
      this.$node.removeAttribute('hidden');
      this.$results.insertAdjacentHTML('beforeend', skeletonTemplate(urls[urls.length-1]));
      return;
    }

    if (leaderboardLoaded === false && urls.length === 0) {
      this.$results.innerHTML = '';
      this.$node.setAttribute('hidden', 'hidden');
      window.history.replaceState({}, '', `${location.pathname}`);
      return;
    }
  }

  init() {
    store.subscribe(this.toggleVisibility.bind(this))
  }
}
