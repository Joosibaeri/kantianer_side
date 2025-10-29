// Setzt die Domain-Grundform in die Hitbox
window.addEventListener('DOMContentLoaded', () => {
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
        if (!filtered.length) {
            list.innerHTML = '<p>Keine Artikel gefunden.</p>';
            return;
        }
        filtered.forEach(article => {
            const card = document.createElement('article');
            card.className = 'article-card';
            card.innerHTML = `
                <a href="/${article.url}" style="text-decoration:none;color:inherit;">
                    <h3>${article.title}</h3>
                </a>
                <p>${article.teaser}</p>
                <div class="article-date">${article.date ? new Date(article.date).toLocaleDateString('de-DE') : ''}</div>
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
        let filtered = articles;
        if (topic) {
            filtered = filtered.filter(a => (a.topic || '').trim() === topic);
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

    fetch('../article.json')
        .then(res => res.json())
        .then(data => {
            articles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (topicSelect) {
                topicSelect.innerHTML = '<option value="">Alle Themen</option>';
                const topics = getTopics(articles);
                console.log('Topics gefunden:', topics); // <--- Debug-Ausgabe
                topics.forEach(topic => {
                    const opt = document.createElement('option');
                    opt.value = topic;
                    opt.textContent = topic;
                    topicSelect.appendChild(opt);
                });
            }
            renderArticles(articles);
        });

    if (searchInput) searchInput.addEventListener('input', filterArticles);
    if (topicSelect) topicSelect.addEventListener('change', filterArticles);
});