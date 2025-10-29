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
                card.innerHTML = `
                    <a href="${article.url}" style="text-decoration:none;color:inherit;">
                        <h3>${article.title}</h3>
                    </a>
                    <p>${article.teaser}</p>
                    <div class="article-date">${new Date(article.date).toLocaleDateString('de-DE')}</div>
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