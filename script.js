document.addEventListener('DOMContentLoaded', function() {
    var impressumLink = document.querySelector('.impressum-link');
    var impressumModal = document.getElementById('impressum');
    if (impressumLink && impressumModal) {
        impressumLink.addEventListener('click', function(e) {
            e.preventDefault();
            impressumModal.style.display = 'block';
        });
        var closeBtn = impressumModal.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                impressumModal.style.display = 'none';
            });
        }
    }
});