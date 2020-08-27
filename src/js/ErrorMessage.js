// import store from './store.js';

export default class ErrorMessage {
  constructor() {
    this.$node = document.querySelector('#error-message');
  }

  async toggleVisibility() {
    const { leaderboardError, leaderboardLoaded } = await store.getState();
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
