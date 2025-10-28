// Setzt die Domain-Grundform in die Hitbox
window.addEventListener('DOMContentLoaded', () => {
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }

    // Artikel aus article.json laden und anzeigen
    fetch('article.json')
        .then(res => res.json())
        .then(articles => {
            // Nach Datum (neueste zuerst) sortieren
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            const list = document.getElementById('article-list');
            list.innerHTML = ''; // Vorherige Inhalte entfernen
            articles.forEach(article => {
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
        })
        .catch(err => {
            document.getElementById('article-list').innerHTML = '<p>Keine Artikel gefunden.</p>';
        });
});