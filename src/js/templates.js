const positions = ['🥇', '🥈', '🥉'];
const healthy = {
  FCP: (value) => value <= 1 ? 'fast' : (value >= 2 ? 'fail' : 'average'),
  LCP: (value) => value <= 2.5 ? 'fast' : (value >= 4 ? 'fail' : 'average'),
  FID: (value) => value <= 100 ? 'fast' : (value >= 300 ? 'fail' : 'average'),
  CLS: (value) => value <= 0.1 ? 'fast' : (value >= 0.25 ? 'fail' : 'average'),
};

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

export function resultTemplate(site, position) {
  const url = site.origin || site.url;

  if (site.metrics === null) {
    return noDataTemplate(url, site.error);
  }

  const fcp = site.metrics.FCP && (site.metrics.FCP.value/1000).toFixed(2) || '-';
  const lcp = site.metrics.LCP && (site.metrics.LCP.value/1000).toFixed(2) || '-';
  const fid = site.metrics.FID && site.metrics.FID.value || '-';
  const cls = site.metrics.CLS && site.metrics.CLS.value || '-';

  return (`
<tr tabindex="0">
<td class="ranking rank-${position}" tabindex="0">${positions[position-1] || position}</td>
<td tabindex="0">${getSiteInfo(url)}</td>
<td class="${healthy.FCP(fcp)}" tabindex="0">${fcp}s</td>
<td class="${healthy.LCP(lcp)}" tabindex="0">${lcp}s</td>
<td class="${healthy.FID(fid)}" tabindex="0">${fid}ms</td>
<td class="${healthy.CLS(cls)}" tabindex="0">${cls}</td>
</tr>
`);
}

export function skeletonTemplate(url) {
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

export function noDataTemplate(url, message) {
  return (`
<tr>
<td class="ranking">-</td>
<td>${getSiteInfo(url)}</td>
<td class="data-not-found" colspan="4">${message}</td>
</tr>
`);
}
