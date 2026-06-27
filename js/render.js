async function load(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error('Failed to load ' + path);
  return r.json();
}

async function renderPublications() {
  const el = document.getElementById('publications-content');
  if (!el) return;
  const pubs = await load('data/publications.json');

  function patentHTML(p) {
    return `
      <div class="pub-item">
        <div class="pub-title">${p.title}</div>
        <div class="pub-meta">Patent No. ${p.number} &mdash; Issued ${p.issued}</div>
      </div>`;
  }

  function pubHTML(p) {
    let meta = '';
    if (p.journal) {
      const vol = p.volume ? `, vol.&nbsp;${p.volume}` : '';
      const doi = p.doi ? ` &mdash; <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>` : '';
      meta = `<em>${p.journal}</em>${vol}, ${p.year}${doi}`;
    } else {
      const pages = p.pages ? `, pp.&nbsp;${p.pages}` : '';
      meta = `${p.venue}${p.location ? ', ' + p.location : ''}, ${p.year}${pages}`;
    }
    return `
      <div class="pub-item">
        <div class="pub-title">${p.title}</div>
        <div class="pub-meta">${meta}</div>
        <div class="pub-authors">${p.authors.join(', ')}</div>
      </div>`;
  }

  const topicClass = { Robotics: 'thesis-badge--robotics', AI: 'thesis-badge--ai', Sensing: 'thesis-badge--sensing' };

  function thesisRowHTML(t) {
    const badge = `<span class="thesis-badge ${topicClass[t.topic] || ''}">${t.topic}</span>`;
    return `
      <tr>
        <td class="thesis-year">${t.year}</td>
        <td class="thesis-body">
          <div class="thesis-student">${t.name}</div>
          <div class="thesis-title">${t.title}</div>
        </td>
        <td class="thesis-badge-col">${badge}</td>
      </tr>`;
  }

  let html = '';
  if (pubs.patents?.length) {
    html += `<div class="pub-group"><h2 class="pub-group-title">Patents</h2>${pubs.patents.map(patentHTML).join('')}</div>`;
  }
  if (pubs.theses?.length) {
    html += `<div class="pub-group"><h2 class="pub-group-title">Graduate Research Direction</h2>
      <table class="thesis-table"><tbody>${pubs.theses.map(thesisRowHTML).join('')}</tbody></table></div>`;
  }
  const allPapers = pubs.papers || [];
  if (allPapers.length) {
    html += `<div class="pub-group"><h2 class="pub-group-title">Journal and Conference Papers</h2>${allPapers.map(p => pubHTML(p)).join('')}</div>`;
  }
  el.innerHTML = html;
}

async function renderPositions() {
  const el = document.getElementById('positions-list');
  if (!el) return;
  const positions = await load('data/positions.json');
  el.innerHTML = `
    <table class="positions-table">
      <tbody>
        ${positions.map(p => `
          <tr>
            <td class="pos-years">${p.years}</td>
            <td class="pos-role">${p.role}</td>
            <td class="pos-inst">${p.institution}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function renderRecentPubs() {
  const el = document.getElementById('recent-pubs');
  if (!el) return;
  const pubs = await load('data/publications.json');
  const recent = (pubs.papers || []).slice(0, 4);

  el.innerHTML = recent.map(p => {
    const venue = p.journal
      ? `<em>${p.journal}</em>, ${p.year}`
      : `${p.venue}, ${p.year}`;
    return `
      <div class="pub-item">
        <div class="pub-title">${p.title}</div>
        <div class="pub-meta">${venue}</div>
        <div class="pub-authors">${p.authors.join(', ')}</div>
      </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderPublications().catch(console.error);
  renderPositions().catch(console.error);
  renderRecentPubs().catch(console.error);
});
