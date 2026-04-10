class ModalComponent {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.modalId = modalId;
    if (!this.modal) {
      this.createModal(modalId, options);
    }
    this.options = options;
    this.bindEvents();
  }

  createModal(modalId, options) {
    const modalHtml = `
      <div id="${modalId}" class="modal-overlay" style="display: none;">
        <div class="modal ${options.size || ''}">
          <div class="modal-header">
            <span class="modal-title">${options.title || ''}</span>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${options.content || ''}
          </div>
          <div class="modal-footer">
            ${options.showFooter !== false ? `
              <button type="button" class="btn btn-secondary modal-cancel">取消</button>
              <button type="button" class="btn btn-primary modal-confirm">确定</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.modal = document.getElementById(modalId);
  }

  bindEvents() {
    if (!this.modal) return;
    
    this.modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    this.modal.querySelector('.modal-cancel')?.addEventListener('click', () => this.close());
    this.modal.querySelector('.modal-confirm')?.addEventListener('click', () => {
      if (this.options.onConfirm) {
        this.options.onConfirm();
      } else {
        this.close();
      }
    });
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal && this.options.closeOnOverlay !== false) {
        this.close();
      }
    });
  }

  open() {
    if (this.modal) this.modal.style.display = 'flex';
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
    if (this.options.onClose) this.options.onClose();
  }

  setTitle(title) {
    const titleEl = this.modal?.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = title;
  }

  setContent(content) {
    const bodyEl = this.modal?.querySelector('.modal-body');
    if (bodyEl) bodyEl.innerHTML = content;
  }

  getBody() {
    return this.modal?.querySelector('.modal-body');
  }

  static alert(message, type = 'info') {
    const alertModal = new ModalComponent(`alert_${Date.now()}`, {
      title: type === 'success' ? '成功' : type === 'error' ? '错误' : '提示',
      content: `<div class="text-center py-3">${message}</div>`,
      size: 'modal-sm',
      showFooter: false
    });
    alertModal.open();
    setTimeout(() => alertModal.close(), 2000);
  }

  static confirm(message) {
    return new Promise((resolve) => {
      const confirmModal = new ModalComponent(`confirm_${Date.now()}`, {
        title: '确认',
        content: `<div class="py-2">${message}</div>`,
        size: 'modal-sm',
        onConfirm: () => {
          confirmModal.close();
          resolve(true);
        },
        onClose: () => resolve(false)
      });
      confirmModal.open();
    });
  }
}

export default ModalComponent;
