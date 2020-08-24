import store from './store.js';

export default class ErrorMessage {
  constructor() {
    this.$node = document.querySelector('#error-message');
  }

  toggleVisibility() {
    const { leaderboardError, leaderboardLoaded } = store.getState();
    if (leaderboardError) {
      this.$node.removeAttribute('hidden');
    } else if (!leaderboardLoaded) {
      this.$node.setAttribute('hidden', 'hidden');
    }
  }

  init() {
    store.subscribe(this.toggleVisibility.bind(this))
  }
}
