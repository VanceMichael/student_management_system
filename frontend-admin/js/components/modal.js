export function openModal(title, bodyContent, footerContent = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyContent;
    document.getElementById('modal-footer').innerHTML = footerContent;
    document.getElementById('modal-overlay').classList.add('active');
}

export function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

export function initModalHandlers() {
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}
