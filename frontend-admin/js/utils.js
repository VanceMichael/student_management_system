export function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

export function showConfirm(message, onConfirm, onCancel = null) {
    openModal('确认操作', `
        <div class="confirm-dialog">
            <div class="confirm-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#ed8936" stroke-width="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="#ed8936" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#ed8936"/>
                </svg>
            </div>
            <p class="confirm-message">${message}</p>
        </div>
    `, `
        <button class="btn btn-secondary" onclick="handleConfirmCancel()">取消</button>
        <button class="btn btn-danger" onclick="handleConfirmOk()">确定</button>
    `);
    
    window._confirmCallback = onConfirm;
    window._cancelCallback = onCancel;
}

export function handleConfirmOk() {
    closeModal();
    if (window._confirmCallback) {
        window._confirmCallback();
        window._confirmCallback = null;
    }
}

export function handleConfirmCancel() {
    closeModal();
    if (window._cancelCallback) {
        window._cancelCallback();
        window._cancelCallback = null;
    }
}

export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN');
}

export function generateId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

export function openModal(title, bodyContent, footerContent = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyContent;
    document.getElementById('modal-footer').innerHTML = footerContent;
    document.getElementById('modal-overlay').classList.add('active');
}

export function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

window.showToast = showToast;
window.showConfirm = showConfirm;
window.handleConfirmOk = handleConfirmOk;
window.handleConfirmCancel = handleConfirmCancel;
window.formatDate = formatDate;
window.generateId = generateId;
window.openModal = openModal;
window.closeModal = closeModal;