window.addEventListener('DOMContentLoaded', () => {
    // Thumbnail für Retina/2x-Displays dynamisch setzen
    const thumbImg = document.getElementById('thumbnail');
    if (thumbImg) {
        // Standard-Thumbnail
        let thumbPng = 'thumbnail.png';
        if (window.devicePixelRatio >= 2) {
            // Versuche, 2x-Variante zu laden, fallback auf Standard
            let thumb2x = 'thumbnail@2x.png';
            thumbImg.src = thumb2x;
            thumbImg.onerror = function() {
                this.onerror = null;
                this.src = thumbPng;
            };
        } else {
            thumbImg.src = thumbPng;
            thumbImg.onerror = function() {
                this.onerror = null;
                this.src = 'placeholder.png';
            };
        }
    }

    // Titel laden
    fetch('header.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('article-title').textContent = text.trim();
        });

    // Autor/Datum laden (erstmal nur Text, Lesedauer kommt später dazu)
    let metaText = '';
    fetch('date_and_writer.txt')
        .then(response => response.text())
        .then(text => {
            metaText = text.trim();
            document.getElementById('article-meta').childNodes[0].textContent = metaText;
        });

    // Artikeltext laden und Lesedauer berechnen
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            // Optional: Zeilenumbrüche in <p> umwandeln
            document.getElementById('article-body').innerHTML = text
                .split('\n\n')
                .map(paragraph => `<p>${paragraph.trim()}</p>`)
                .join('');

            // Lesedauer berechnen (ca. 120 Wörter/Minute)
            const words = text.trim().split(/\s+/).length;
            const minutes = Math.max(1, Math.round(words / 150));
            const lesezeit = ` ⏱️ ca. ${minutes} Min. Lesezeit`;
            // Füge Lesedauer in eigenes <span> ein
            const readingTimeElem = document.getElementById('reading-time');
            if (readingTimeElem) {
                readingTimeElem.textContent = lesezeit;
            }
        });

    // Hitbox-Link dynamisch auf die Domain setzen (optional)
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }
});