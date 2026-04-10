/**
 * 表格组件
 */

// 渲染表格
function renderTable(containerId, data, columns, actions = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');
    
    if (thead) {
        thead.innerHTML = `<tr>${columns.map(col => `<th>${col.title}</th>`).join('')}${actions ? '<th>操作</th>' : ''}</tr>`;
    }
    
    if (tbody) {
        tbody.innerHTML = data.map((row, index) => `
            <tr>
                ${columns.map(col => `<td>${row[col.key] || '-'}</td>`).join('')}
                ${actions ? `<td><div class="table-actions">${actions(row, index)}</div></td>` : ''}
            </tr>
        `).join('');
    }
}

// 创建分页
function createPagination(containerId, total, pageSize, currentPage, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const totalPages = Math.ceil(total / pageSize);
    
    let html = '';
    
    // 上一页
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">上一页</button>`;
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span>...</span>`;
        }
    }
    
    // 下一页
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">下一页</button>`;
    
    container.innerHTML = html;
}

export { renderTable, createPagination };
