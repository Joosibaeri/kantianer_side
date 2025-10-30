// Setzt die Domain-Grundform in die Hitbox
window.addEventListener('DOMContentLoaded', () => {
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }

    const pageSize = 10;
    let articles = [];
    let currentIndex = 0;
    const list = document.getElementById('article-list');
    const loadMoreBtn = document.getElementById('load-more');

    function filterArticles(query) {
        return articles;
    }

    function renderArticles(filtered) {
        if (!list) return;
        list.innerHTML = '';
        if (filtered.length === 0) {
            list.innerHTML = '<p>Keine Artikel gefunden.</p>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        const slice = filtered.slice(0, pageSize);
        slice.forEach(article => {
            const card = document.createElement('article');
            card.className = 'article-card';
            // Thumbnail nur auf Desktop anzeigen (ab 700px)
            let thumbHtml = '';
            if (window.innerWidth >= 700) {
                const baseUrl = article.url.replace(/\/$/, '');
                let thumbPng = baseUrl + '/thumbnail.png';
                // Für Retina/HiDPI: Versuche thumbnail@2x.png
                if (window.devicePixelRatio >= 2) {
                    const thumb2x = baseUrl + '/thumbnail@2x.png';
                    thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumb2x}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='${thumbPng}';\"></div>`;
                } else {
                    thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumbPng}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='placeholder.png';\"></div>`;
                }
            }
            card.innerHTML = `
                <a href="${article.url}" style="text-decoration:none;color:inherit;display:flex;align-items:flex-start;gap:1.2rem;">
                    ${thumbHtml}
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p>${article.teaser}</p>
                        <div class="article-date">${new Date(article.date).toLocaleDateString('de-DE')}</div>
                    </div>
                </a>
            `;
            list.appendChild(card);
        });
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    function renderNext() {
        if (!list) return;
        const slice = articles.slice(currentIndex, currentIndex + pageSize);

        // Falls beim ersten Laden keine Artikel vorhanden sind
        if (slice.length === 0 && currentIndex === 0) {
            list.innerHTML = '<p>Keine Artikel gefunden.</p>';
        } else {
            slice.forEach(article => {
                const card = document.createElement('article');
                card.className = 'article-card';
                let thumbHtml = '';
                if (window.innerWidth >= 700) {
                    const baseUrl = article.url.replace(/\/$/, '');
                    let thumbPng = baseUrl + '/thumbnail.png';
                    if (window.devicePixelRatio >= 2) {
                        const thumb2x = baseUrl + '/thumbnail@2x.png';
                        thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumb2x}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='${thumbPng}';\"></div>`;
                    } else {
                        thumbHtml = `<div class=\"article-thumb\"><img src=\"${thumbPng}\" alt=\"Vorschaubild zu ${article.title}\" loading=\"lazy\" onerror=\"this.onerror=null;this.src='placeholder.png';\"></div>`;
                    }
                }
                card.innerHTML = `
                    <a href="${article.url}" style="text-decoration:none;color:inherit;display:flex;align-items:flex-start;gap:1.2rem;">
                        ${thumbHtml}
                        <div class="article-content">
                            <h3>${article.title}</h3>
                            <p>${article.teaser}</p>
                            <div class="article-date">${new Date(article.date).toLocaleDateString('de-DE')}</div>
                        </div>
                    </a>
                `;
                list.appendChild(card);
            });
        }

        currentIndex += slice.length;

        if (loadMoreBtn) {
            if (currentIndex >= articles.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
        }
    }

    // Artikel laden und initial anzeigen
    fetch('article.json')
        .then(res => res.json())
        .then(data => {
            articles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (list) list.innerHTML = '';
            currentIndex = 0;
            renderNext();
        })
        .catch(err => {
            if (list) list.innerHTML = '<p>Keine Artikel gefunden.</p>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderNext();
        });
    }
});