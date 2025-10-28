window.addEventListener('DOMContentLoaded', () => {
    const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    const link = document.getElementById('domain-link');
    if (link) {
        link.href = domain + "/";
    }
});