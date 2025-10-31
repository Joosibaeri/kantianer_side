// Setzt die Domain-Grundform in die Hitbox
window.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }

    // Artikelliste, Suche und Topic-Filter
    const list = document.getElementById('article-list');
    const searchInput = document.getElementById('search-input');
    const topicSelect = document.getElementById('topic-select');
    let articles = [];

    function renderArticles(filtered) {
        if (!list) return;
        list.innerHTML = '';
        // Ergebniszähler anzeigen
        const countElem = document.getElementById('article-count');
        if (countElem) {
            countElem.textContent = filtered.length === 1
                ? '1 Artikel gefunden'
                : filtered.length + ' Artikel gefunden';
        }
        if (!filtered.length) {
            list.innerHTML += '<p>Keine Artikel gefunden.</p>';
            return;
        }
        filtered.forEach(article => {
            const card = document.createElement('article');
            card.className = 'article-card';
            let thumbHtml = '';
            if (window.innerWidth >= 700) {
                const baseUrl = '/' + article.url.replace(/\/$/, '');
                let thumbPng = baseUrl + '/thumbnail.png';
                if (window.devicePixelRatio >= 2) {
                    const thumb2x = baseUrl + '/thumbnail@2x.png';
                    thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumb2x}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='${thumbPng}';\"></div>`;
                } else {
                    thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumbPng}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='placeholder.png';\"></div>`;
                }
            }
            card.innerHTML = `
                <a href="/${article.url}" style="text-decoration:none;color:inherit;display:flex;align-items:flex-start;gap:1.2rem;">
                    ${thumbHtml}
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p>${article.teaser}</p>
                        <div class="article-date">${article.date ? new Date(article.date).toLocaleDateString('de-DE') : ''}</div>
                    </div>
                </a>
            `;
            list.appendChild(card);
        });
    }

    function getTopics(articles) {
        // Wenn Topic-Feld existiert, extrahiere alle Topics (exakt wie in JSON, sortiert)
        const topics = new Set();
        articles.forEach(a => {
            if (a.topic) topics.add(a.topic.trim());
        });
        return Array.from(topics).sort((a, b) => a.localeCompare(b));
    }

    function filterArticles() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const topic = topicSelect ? topicSelect.value : '';
        const year = yearSelect ? yearSelect.value : '';
        let filtered = articles;
        if (topic) {
            filtered = filtered.filter(a => (a.topic || '').trim() === topic);
        }
        if (year) {
            filtered = filtered.filter(a => a.date && new Date(a.date).getFullYear().toString() === year);
        }
        if (query) {
            const words = query.split(/\s+/);
            filtered = filtered.filter(article => {
                const text = (article.title + ' ' + article.teaser).toLowerCase();
                return words.every(word => text.includes(word));
            });
        }
        renderArticles(filtered);
    }

    fetch('article.json')
        .then(res => res.json())
        .then(data => {
            articles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (topicSelect) {
                topicSelect.innerHTML = '<option value="">Alle Themen</option>';
                const topics = getTopics(articles);
                topics.forEach(topic => {
                    const opt = document.createElement('option');
                    opt.value = topic;
                    opt.textContent = topic;
                    topicSelect.appendChild(opt);
                });
            }
            if (yearSelect) {
                const years = Array.from(new Set(articles.map(a => a.date ? new Date(a.date).getFullYear().toString() : null).filter(Boolean))).sort((a, b) => b - a);
                yearSelect.innerHTML = '<option value="">Alle Jahre</option>';
                years.forEach(year => {
                    const opt = document.createElement('option');
                    opt.value = year;
                    opt.textContent = year;
                    yearSelect.appendChild(opt);
                });
            }
            renderArticles(articles);
        });

    if (searchInput) searchInput.addEventListener('input', filterArticles);
    if (topicSelect) topicSelect.addEventListener('change', filterArticles);
    if (yearSelect) yearSelect.addEventListener('change', filterArticles);
});