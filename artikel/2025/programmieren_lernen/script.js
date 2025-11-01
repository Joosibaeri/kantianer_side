window.addEventListener('DOMContentLoaded', () => {

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
            // Wörter ab 16 Zeichen mit <wbr> trennen
            function insertWbr(word) {
                if (word.length >= 16) {
                    // Füge <wbr> nach jedem 15. Zeichen ein
                    return word.replace(/(.{15})/g, '$1<wbr>');
                }
                return word;
            }
            // Paragraphen splitten und Wörter prüfen
            const html = text.split('\n\n').map(paragraph => {
                return '<p>' + paragraph.trim().split(/(\s+)/).map(token => {
                    // Nur auf Wörter anwenden, nicht auf Leerzeichen
                    return token.trim().length > 0 ? insertWbr(token) : token;
                }).join('') + '</p>';
            }).join('');
            document.getElementById('article-body').innerHTML = html;

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