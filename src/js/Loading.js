import store from './store.js';

export default class Loading {
  constructor() {
    this.$node = document.querySelector('#loading');
  }

  toggleVisibility() {
    const { running, leaderboardLoaded } = store.getState();
    if (running) {
      this.$node.removeAttribute('hidden');
    } else if (leaderboardLoaded) {
      this.$node.setAttribute('hidden', 'hidden');
    }
  }

  init() {
    store.subscribe(this.toggleVisibility.bind(this))
  }
}
