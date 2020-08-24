import store from './store.js';

export default class LeaderboardControl {
  constructor() {
    this.$node = document.querySelector('form');
    this.$from = document.querySelector('#from');
    this.$input = document.querySelector('#url');
    this.$run = document.querySelector('#run');
    this.$reset = document.querySelector('#reset');
  }

  toggleDisabled() {
    const { leaderboardLoaded, urls } = store.getState();
    if (leaderboardLoaded === false && urls.length === 1) {
      this.$run.removeAttribute('disabled');
      this.$reset.removeAttribute('disabled');
      return;
    }

    if (leaderboardLoaded === false) {
      this.$run.setAttribute('disabled', 'disabled');
      this.$reset.setAttribute('disabled', 'disabled');
      return;
    }
  }

  addEvents() {
    this.$node.addEventListener('submit', (eve) => {
      eve.preventDefault();

      if (eve.submitter.id === 'add') {
        const { leaderboardLoaded } = store.getState();

        if (leaderboardLoaded) {
          store.dispatch({ type: 'RESET' });
        }

        store.dispatch({
          type: 'ADD_URL',
          value: this.$input.value,
        });

      } else if (eve.submitter.id === 'run') {
        store.dispatch({ type: 'RUN_LEADERBOARD' });

        const { from, urls } = store.getState();
        const params = new URLSearchParams(`from=${from}&competitors=${urls.join(',')}`);
        window.history.replaceState({}, '', `${location.pathname}?${params}`);

        ga('send', {
          hitType: 'event',
          eventCategory: 'Leaderboard',
          eventAction: 'run',
          eventLabel: urls.join(','),
        });
      }
      this.$input.value = '';
    });

    this.$reset.addEventListener('click', () => store.dispatch({ type: 'RESET' }));
    this.$from.addEventListener('change', function () {
      store.dispatch({ type: 'CHANGE_FROM', value: this.value });
    });
  }

  init() {
    this.addEvents();
    store.subscribe(this.toggleDisabled.bind(this))
  }
}

