window.addEventListener('DOMContentLoaded', () => {
    // Titel laden
    fetch('header.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('article-title').textContent = text.trim();
        });

    // Autor/Datum laden
    fetch('date_and_writer.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('article-meta').textContent = text.trim();
        });

    // Artikeltext laden
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            // Optional: Zeilenumbrüche in <p> umwandeln
            document.getElementById('article-body').innerHTML = text
                .split('\n\n')
                .map(paragraph => `<p>${paragraph.trim()}</p>`)
                .join('');
        });
});