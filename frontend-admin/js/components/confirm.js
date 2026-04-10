/**
 * 确认对话框组件
 */

import { openModal, closeModal } from './modal.js';

// 显示确认对话框
function showConfirm(message, onConfirm, onCancel = null) {
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
        <button class="btn btn-secondary" onclick="window.handleConfirmCancel()">取消</button>
        <button class="btn btn-danger" onclick="window.handleConfirmOk()">确定</button>
    `);
    
    // 存储回调函数
    window._confirmCallback = onConfirm;
    window._cancelCallback = onCancel;
}

// 确认按钮处理
function handleConfirmOk() {
    closeModal();
    if (window._confirmCallback) {
        window._confirmCallback();
        window._confirmCallback = null;
    }
}

// 取消按钮处理
function handleConfirmCancel() {
    closeModal();
    if (window._cancelCallback) {
        window._cancelCallback();
        window._cancelCallback = null;
    }
}

// 暴露到全局
window.handleConfirmOk = handleConfirmOk;
window.handleConfirmCancel = handleConfirmCancel;

export { showConfirm };
