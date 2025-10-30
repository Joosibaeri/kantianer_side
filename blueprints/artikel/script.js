// Scroll-to-top Button
window.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({top:0, behavior:'smooth'});
    });
    // Button immer direkt nach dem Artikeltext platzieren, mittig, mit Abstand zum Footer
    const articleBody = document.getElementById('article-body');
    if (articleBody && scrollBtn.parentNode !== articleBody.parentNode) {
        articleBody.insertAdjacentElement('afterend', scrollBtn);
    }
});
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

    // Hitbox-Link dynamisch auf die Domain setzen (optional)
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }
});