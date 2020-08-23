!function(){
  var lastBtn = null;
  document.addEventListener('click',function(e){
      if (!e.target.closest) return;
      lastBtn = e.target.closest('button, input[type=submit]');
  }, true);
  document.addEventListener('submit', function(e){
      if ('submitter' in e) return;
      var canditates = [document.activeElement, lastBtn];
      for (var i=0; i < canditates.length; i++) {
          var candidate = canditates[i];
          if (!candidate) continue;
          if (!candidate.form) continue;
          if (!candidate.matches('button, input[type=button], input[type=image]')) continue;
          e.submitter = candidate;
          return;
      }
      e.submitter = e.target.querySelector('button, input[type=button], input[type=image]')
  }, true);
}();

function getSiteInfo(url) {
  const { host } = new URL(url);
  return `
<img class="logo" width="32" height="32" src="${`https://api.faviconkit.com/${host}/144`}" alt="${url}"/>
<div class="site">
<h5>${host.split('.')[1].toUpperCase()}</h5>
<a href="${url}" class="url" target="_blank" rel="noopener noreferrer" title="${url}">${url}</a>
</div>
  `
}

function template(site, position) {
  const url = site.origin || site.url;

  if (site.metrics === null) {
    return noDataTemplate(url, site.error);
  }

  const fcp = site.metrics.FCP && (site.metrics.FCP.value/1000).toFixed(2) || '-';
  const lcp = site.metrics.LCP && (site.metrics.LCP.value/1000).toFixed(2) || '-';
  const fid = site.metrics.FID && site.metrics.FID.value || '-';
  const cls = site.metrics.CLS && site.metrics.CLS.value || '-';

  return (`
<tr>
<td class="ranking rank-${position}">${positions[position-1] || position}</td>
<td>${getSiteInfo(url)}</td>
<td class="${healthy.FCP(fcp)}">${fcp}s</td>
<td class="${healthy.LCP(lcp)}">${lcp}s</td>
<td class="${healthy.FID(fid)}">${fid}ms</td>
<td class="${healthy.CLS(cls)}">${cls}</td>
</tr>
`);
}

function skeletonTemplate(url) {
  return (`
<tr>
<td class="ranking">-</td>
<td>${getSiteInfo(url)}</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
</tr>
`);
}

function noDataTemplate(url, message) {
  return (`
<tr>
<td class="ranking">-</td>
<td>${getSiteInfo(url)}</td>
<td class="data-not-found" colspan="4">${message}</td>
</tr>
`);
}

const positions = ['🥇', '🥈', '🥉'];
const healthy = {
  FCP: (value) => value <= 1 ? 'fast' : (value >= 2 ? 'fail' : 'average'),
  LCP: (value) => value <= 2.5 ? 'fast' : (value >= 4 ? 'fail' : 'average'),
  FID: (value) => value <= 100 ? 'fast' : (value >= 300 ? 'fail' : 'average'),
  CLS: (value) => value <= 0.1 ? 'fast' : (value >= 0.25 ? 'fail' : 'average'),
};

function sortBy(metric) {
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

const urls = [];
const $from = document.querySelector('#from');
const $input = document.querySelector('#url');
const $run = document.querySelector('#run');
const $reset = document.querySelector('#reset');
const $form = document.querySelector('form');
const $content = document.querySelector('#content');
const $table = document.querySelector('table');
const $filters = document.querySelector('#filters');
const $loading = document.querySelector('#loading');
const $deviceFilter = document.querySelector('#device-filter');
const $connectionFilter = document.querySelector('#connection-filter');
const $errorMessage = document.querySelector('#error-message');

const formData = new FormData($form);
$form.addEventListener('submit', function(eve) {
  eve.preventDefault();
  if (eve.submitter.id === 'add') {
    if (urls.length === 0) {
      reset();
      $run.removeAttribute('disabled');
      $reset.removeAttribute('disabled');
    }
    add();
  } else if (eve.submitter.id === 'run') {
    run({ [$from.value]: urls });

    const params = new URLSearchParams(`from=${$from.value}&competitors=${urls.join(',')}`);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);

    ga('send', {
      hitType: 'event',
      eventCategory: 'Leaderboard',
      eventAction: 'run',
      eventLabel: urls.join(','),
    });
  }
  $input.value = '';
});

$reset.addEventListener('click', reset);
$from.addEventListener('change', reset);

$deviceFilter.addEventListener('change', function() {
  run({
    device: this.value,
    connection: $connectionFilter.value,
    [$from.value]: urls.length === 0 ? demoUrls : urls,
  });
});

$connectionFilter.addEventListener('change', function() {
  run({
    connection: this.value,
    device: $deviceFilter.value,
    [$from.value]: urls.length === 0 ? demoUrls : urls,
  });
});

function add() {
  urls.push($input.value);
  $content.insertAdjacentHTML('beforeend', skeletonTemplate($input.value));
  $table.removeAttribute('hidden');
}

function run(data) {
  $table.setAttribute('hidden', 'hidden');
  $filters.setAttribute('hidden', 'hidden');
  $errorMessage.setAttribute('hidden', 'hidden');
  $loading.removeAttribute('hidden');
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
        $loading.setAttribute('hidden', 'hidden');
        $filters.removeAttribute('hidden');
        $errorMessage.removeAttribute('hidden');
        return;
      }

      const html = results
        .sort(sortBy('LCP'))
        .map((result, index) => template(result, index+=1));

      $content.innerHTML = '';
      $content.insertAdjacentHTML('beforeend', html.join(''));
      $loading.setAttribute('hidden', 'hidden');
      $errorMessage.setAttribute('hidden', 'hidden');
      $table.removeAttribute('hidden');
      $filters.removeAttribute('hidden');
    })
    .catch(() => {
      $loading.setAttribute('hidden', 'hidden');
      $errorMessage.removeAttribute('hidden');
    })
}

function reset() {
  urls.length = 0;
  $content.innerHTML = '';
  $errorMessage.setAttribute('hidden', 'hidden');
  $table.setAttribute('hidden', 'hidden');
  $filters.setAttribute('hidden', 'hidden');
  window.history.replaceState({}, '', `${location.pathname}`);
}

const demoUrls = [
  'https://www.cnn.com',
  'https://www.nytimes.com',
  'https://www.foxnews.com',
  'https://www.theguardian.com/international',
  'https://www.washingtonpost.com',
];

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
if (params.has('competitors')) {
  urls.push(...params.get('competitors').split(','));
  run({ [params.get('from')]: urls });
  $reset.removeAttribute('disabled');
  ga('send', {
    hitType: 'event',
    eventCategory: 'Leaderboard',
    eventAction: 'share',
    eventLabel: urls.join(','),
  });
} else {
  run({ urls: demoUrls });
}

window.addEventListener('load', () => {
  document.querySelector('#twitter').src = 'https://platform.twitter.com/widgets/tweet_button.html?url=%0A%0A%F0%9F%93%8A%20https%3A%2F%2Fvitals-leaderboard.pazguille.me&text=%E2%9A%A1%EF%B8%8FWeb%20Vitals%20Leaderboard!%0A%0AThe%20simplest%20way%20to%20understand%20how%20your%20website%E2%80%99s%20performance%20compares%20to%20other%20sites%20in%20your%20industry.';
});
