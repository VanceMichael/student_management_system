import { escapeHtml } from '../modules/utils.js';

class TableComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Table container #${containerId} not found`);
      return;
    }
    this.options = {
      columns: options.columns || [],
      data: options.data || [],
      actions: options.actions || [],
      className: options.className || 'table table-striped table-hover',
      onAction: options.onAction || (() => {})
    };
    this.render();
  }

  render() {
    if (!this.container) return;
    
    const { columns, data, actions, className } = this.options;
    
    let html = `<table class="${className}"><thead><tr>`;
    
    columns.forEach(col => {
      html += `<th>${col.label}</th>`;
    });
    
    if (actions.length > 0) {
      html += '<th>操作</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    data.forEach((row, rowIndex) => {
      html += '<tr>';
      columns.forEach(col => {
        let value = row[col.field] ?? '';
        if (col.formatter) {
          value = col.formatter(value, row, rowIndex);
        } else {
          value = escapeHtml(String(value));
        }
        html += `<td>${value}</td>`;
      });
      
      if (actions.length > 0) {
        html += '<td>';
        actions.forEach(action => {
          html += `<button class="btn btn-sm ${action.class} action-btn" 
            data-action="${action.name}" 
            data-row="${rowIndex}"
            data-id="${row.id || ''}">${action.label}</button>`;
        });
        html += '</td>';
      }
      
      html += '</tr>';
    });
    
    if (data.length === 0) {
      html += `<tr><td colspan="${columns.length + actions.length > 0 ? 1 : 0}" class="text-center text-muted py-4">暂无数据</td></tr>`;
    }
    
    html += '</tbody></table>';
    this.container.innerHTML = html;
    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const rowIndex = parseInt(e.target.dataset.row);
        const id = e.target.dataset.id;
        const rowData = this.options.data[rowIndex];
        this.options.onAction(action, rowData, id, rowIndex);
      });
    });
  }

  setData(data) {
    this.options.data = data;
    this.render();
  }

  setColumns(columns) {
    this.options.columns = columns;
    this.render();
  }

  getData() {
    return this.options.data;
  }
}

export default TableComponent;
