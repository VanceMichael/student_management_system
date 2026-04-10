import Store from './store.js';
import { generateId, formatDate, showNotification, escapeHtml } from './utils.js';

const BehaviorModule = {
  currentStudentId: null,
  currentTab: 'health',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    ['health', 'reward', 'growth'].forEach(tab => {
      const addBtn = document.getElementById(`add${tab.charAt(0).toUpperCase() + tab.slice(1)}Btn`);
      if (addBtn) {
        addBtn.addEventListener('click', () => this.showForm(tab));
      }

      const form = document.getElementById(`${tab}Form`);
      if (form) {
        form.addEventListener('submit', (e) => this.handleSave(e, tab));
      }
    });

    ['healthTable', 'rewardTable', 'growthTable'].forEach(tableId => {
      document.getElementById(tableId)?.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
          const type = tableId.replace('Table', '');
          this.deleteRecord(type, e.target.dataset.id);
        }
      });
    });
  },

  setStudent(studentId) {
    this.currentStudentId = studentId;
    this.renderAll();
  },

  renderAll() {
    this.renderHealthRecords();
    this.renderRewardRecords();
    this.renderGrowthRecords();
  },

  renderHealthRecords() {
    const records = Store.healthRecords.filter(r => r.studentId === this.currentStudentId);
    const tbody = document.querySelector('#healthTable tbody');
    if (!tbody) return;

    tbody.innerHTML = records.map(record => `
      <tr>
        <td>${formatDate(record.checkDate)}</td>
        <td>${record.height} cm</td>
        <td>${record.weight} kg</td>
        <td>${record.vision || '-'}</td>
        <td><span class="badge ${record.status === 'healthy' ? 'bg-success' : 'bg-warning'}">
          ${record.status === 'healthy' ? '健康' : record.status === 'follow_up' ? '需观察' : '异常'}
        </span></td>
        <td>${escapeHtml(record.notes || '-')}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  renderRewardRecords() {
    const records = Store.rewardRecords.filter(r => r.studentId === this.currentStudentId);
    const tbody = document.querySelector('#rewardTable tbody');
    if (!tbody) return;

    tbody.innerHTML = records.map(record => `
      <tr>
        <td>${formatDate(record.date)}</td>
        <td><span class="badge ${record.type === 'reward' ? 'bg-success' : 'bg-danger'}">
          ${record.type === 'reward' ? '奖励' : '惩罚'}
        </span></td>
        <td>${escapeHtml(record.reason)}</td>
        <td>${escapeHtml(record.description || '-')}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  renderGrowthRecords() {
    const records = Store.growthRecords.filter(r => r.studentId === this.currentStudentId);
    const tbody = document.querySelector('#growthTable tbody');
    if (!tbody) return;

    tbody.innerHTML = records.map(record => `
      <tr>
        <td>${formatDate(record.date)}</td>
        <td>${record.category}</td>
        <td>${escapeHtml(record.title)}</td>
        <td>${escapeHtml(record.content || '-')}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  showForm(type) {
    document.getElementById(`${type}Form`).reset();
    document.getElementById(`${type}Modal`).dataset.mode = 'add';
    document.getElementById(`${type}Modal`).style.display = 'block';
  },

  handleSave(e, type) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.studentId = this.currentStudentId;
    data.id = generateId();

    switch(type) {
      case 'health':
        Store.addHealthRecord(data);
        break;
      case 'reward':
        Store.addRewardRecord(data);
        break;
      case 'growth':
        Store.addGrowthRecord(data);
        break;
    }

    document.getElementById(`${type}Modal`).style.display = 'none';
    showNotification('记录添加成功', 'success');
    this.renderAll();
  },

  deleteRecord(type, id) {
    if (confirm('确定要删除这条记录吗？')) {
      switch(type) {
        case 'health':
          Store.deleteHealthRecord(id);
          break;
        case 'reward':
          Store.deleteRewardRecord(id);
          break;
        case 'growth':
          Store.deleteGrowthRecord(id);
          break;
      }
      showNotification('记录已删除', 'success');
      this.renderAll();
    }
  },

  showHealthModal() {
    this.showForm('health');
  },

  showRewardModal(type) {
    this.showForm('reward');
  },

  searchGrowthRecord() {
    showNotification('搜索成长记录', 'info');
  },

  showGrowthModal() {
    this.showForm('growth');
  }
};

export default BehaviorModule;
