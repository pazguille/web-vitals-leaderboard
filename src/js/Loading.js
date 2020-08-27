// import store from './store.js';

export default class Loading {
  constructor() {
    this.$node = document.querySelector('#loading');
  }

  async toggleVisibility() {
    const { running, leaderboardLoaded } = await store.getState();
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
