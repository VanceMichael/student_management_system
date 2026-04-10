/**
 * Toast 通知组件
 */

// 显示通知
function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    
    // 如果toast元素不存在，创建一个
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

export { showToast };
