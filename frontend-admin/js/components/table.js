export function renderTable(containerId, { columns, data, actions = null }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    if (thead) {
        thead.innerHTML = `<tr>${columns.map(col => `<th>${col.label}</th>`).join('')}${actions ? '<th>操作</th>' : ''}</tr>`;
    }

    if (tbody) {
        tbody.innerHTML = data.map(row =>
            `<tr>${columns.map(col => `<td>${row[col.key] || '-'}</td>`).join('')}${actions ? `<td><div class="table-actions">${actions(row)}</div></td>` : ''}</tr>`
        ).join('');
    }
}

export function initStudentListTable() {
    renderTable('student-list-table', {
        columns: [
            { key: 'name', label: '姓名' },
            { key: 'gender', label: '性别' },
            { key: 'className', label: '班级' },
            { key: 'studentNo', label: '学号' },
            { key: 'contact', label: '联系方式' },
            { key: 'addTime', label: '添加时间' }
        ]
    });
}
