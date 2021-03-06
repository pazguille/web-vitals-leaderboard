import store from './store.js';
import LeaderboardResults from './Leaderboard.js';
import Loading from './Loading.js';
import LeaderboardControl from './LeaderboardControl.js';
import Filter from './Filter.js';
import ErrorMessage from './ErrorMessage.js';

const demoUrls = [
  'https://www.cnn.com',
  'https://www.nytimes.com',
  'https://www.foxnews.com',
  'https://www.theguardian.com/international',
  'https://www.washingtonpost.com',
];

export default function bootApp() {
  new LeaderboardResults().init();
  new Loading().init();

  requestIdleCallback(() => {
    new LeaderboardControl().init();
    new Filter().init();
    new ErrorMessage().init();
  });

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  if (params.has('competitors')) {
    store.dispatch({
      type: 'LEADERBOARD_UPDATE',
      urls: params.get('competitors').split(','),
      from: params.get('from'),
    });
    const { urls } = store.getState();
    requestIdleCallback(() => {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Leaderboard',
        eventAction: 'share',
        eventLabel: urls.join(','),
      });
    });
  } else {
    store.dispatch({
      type: 'LEADERBOARD_UPDATE',
      urls: demoUrls,
    });
  }
}
