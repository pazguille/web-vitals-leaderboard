// import store from './store.js';

export default class Filter {
  constructor() {
    this.$node = document.querySelector('#filters');
    this.$device = document.querySelector('#device-filter');
    this.$connection = document.querySelector('#connection-filter');
  }

  async toggleVisibility() {
    const { leaderboardLoaded, running, leaderboardError } = await store.getState();
    if (leaderboardLoaded && running) {
      this.$node.setAttribute('hidden', 'hidden');
      return;
    }

    if (leaderboardLoaded && !leaderboardError) {
      this.$node.removeAttribute('hidden');
      return;
    }

    if (leaderboardLoaded === false) {
      this.$node.setAttribute('hidden', 'hidden');
      return;
    }
  }

  addEvents() {
    this.$device.addEventListener('change', function() {
      store.dispatch({
        type: 'CHANGE_DEVICE',
        value: this.value,
      });
    });

    this.$connection.addEventListener('change', function() {
      store.dispatch({
        type: 'CHANGE_CONNECTION',
        value: this.value,
      });
    });

  }

  init() {
    this.addEvents();
    store.subscribe(this.toggleVisibility.bind(this))
  }
}

