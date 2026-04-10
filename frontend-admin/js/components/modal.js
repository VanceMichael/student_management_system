/**
 * 模态框组件
 */

// 打开模态框
function openModal(title, bodyContent, footerContent = '') {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyContent;
    if (modalFooter) modalFooter.innerHTML = footerContent;
    if (modalOverlay) modalOverlay.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

export { openModal, closeModal };
