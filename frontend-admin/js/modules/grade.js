import Store from './store.js';
import { generateId, formatDate, showNotification, escapeHtml } from './utils.js';

const GradeModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const addBtn = document.getElementById('addGradeBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showForm());
    }

    const form = document.getElementById('gradeForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSave(e));
    }

    document.getElementById('gradeTable')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        this.editGrade(e.target.dataset.id);
      } else if (e.target.classList.contains('delete-btn')) {
        this.deleteGrade(e.target.dataset.id);
      }
    });

    const statsBtn = document.getElementById('showGradeStats');
    if (statsBtn) {
      statsBtn.addEventListener('click', () => this.showStats());
    }
  },

  renderList() {
    const grades = Store.grades;
    const tbody = document.querySelector('#gradeTable tbody');
    if (!tbody) return;

    tbody.innerHTML = grades.map(grade => {
      const student = Store.findStudent(s => s.id === grade.studentId);
      return `
      <tr>
        <td>${student ? escapeHtml(student.studentId) : '-'}</td>
        <td>${student ? escapeHtml(student.name) : '-'}</td>
        <td>${student ? escapeHtml(student.className) : '-'}</td>
        <td>${escapeHtml(grade.subject)}</td>
        <td>${grade.score}</td>
        <td>${this.getGradeLevel(grade.score)}</td>
        <td>${formatDate(grade.examDate)}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${grade.id}">编辑</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${grade.id}">删除</button>
        </td>
      </tr>
    `}).join('');
  },

  getGradeLevel(score) {
    if (score >= 90) return '<span class="badge bg-success">优秀</span>';
    if (score >= 80) return '<span class="badge bg-info">良好</span>';
    if (score >= 60) return '<span class="badge bg-warning">及格</span>';
    return '<span class="badge bg-danger">不及格</span>';
  },

  showForm() {
    const form = document.getElementById('gradeForm');
    form.reset();
    document.getElementById('gradeModalTitle').textContent = '添加成绩';
    document.getElementById('gradeModal').dataset.mode = 'add';
    document.getElementById('gradeModal').style.display = 'block';
  },

  editGrade(id) {
    const grade = Store.grades.find(g => g.id === id);
    if (!grade) return;

    document.getElementById('gradeModalTitle').textContent = '编辑成绩';
    document.getElementById('gradeModal').dataset.mode = 'edit';
    document.getElementById('gradeModal').dataset.editId = id;
    document.getElementById('gradeStudent').value = grade.studentId || '';
    document.getElementById('gradeSubject').value = grade.subject || '';
    document.getElementById('gradeScore').value = grade.score || '';
    document.getElementById('gradeExamDate').value = grade.examDate || '';
    document.getElementById('gradeTerm').value = grade.term || '';
    document.getElementById('gradeNotes').value = grade.notes || '';
    document.getElementById('gradeModal').style.display = 'block';
  },

  handleSave(e) {
    e.preventDefault();
    const modal = document.getElementById('gradeModal');
    const mode = modal.dataset.mode;
    const editId = modal.dataset.editId;

    const gradeData = {
      studentId: document.getElementById('gradeStudent').value,
      subject: document.getElementById('gradeSubject').value,
      score: parseFloat(document.getElementById('gradeScore').value),
      examDate: document.getElementById('gradeExamDate').value,
      term: document.getElementById('gradeTerm').value,
      notes: document.getElementById('gradeNotes').value
    };

    if (mode === 'edit') {
      Store.updateGrade(editId, gradeData);
      showNotification('成绩更新成功', 'success');
    } else {
      gradeData.id = generateId();
      Store.addGrade(gradeData);
      showNotification('成绩添加成功', 'success');
    }

    modal.style.display = 'none';
    this.renderList();
  },

  deleteGrade(id) {
    if (confirm('确定要删除这条成绩记录吗？')) {
      Store.deleteGrade(id);
      showNotification('成绩记录已删除', 'success');
      this.renderList();
    }
  },

  showStats() {
    const stats = this.calculateStats();
    document.getElementById('statsAvg').textContent = stats.average.toFixed(1);
    document.getElementById('statsPassRate').textContent = (stats.passRate * 100).toFixed(1) + '%';
    document.getElementById('statsExcellentRate').textContent = (stats.excellentRate * 100).toFixed(1) + '%';
    document.getElementById('statsMax').textContent = stats.max;
    document.getElementById('statsMin').textContent = stats.min;
    document.getElementById('gradeStatsModal').style.display = 'block';
  },

  calculateStats() {
    const grades = Store.grades;
    if (!grades.length) return { average: 0, passRate: 0, excellentRate: 0, max: 0, min: 0 };
    
    const scores = grades.map(g => g.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const passCount = scores.filter(s => s >= 60).length;
    const excellentCount = scores.filter(s => s >= 90).length;
    
    return {
      average,
      passRate: passCount / scores.length,
      excellentRate: excellentCount / scores.length,
      max: Math.max(...scores),
      min: Math.min(...scores)
    };
  },

  renderCharts() {
    this.showStats();
  },

  downloadTemplate() {
    showNotification('模板下载功能', 'info');
  },

  loadStudentTrend() {
    showNotification('趋势分析功能', 'info');
  },

  searchByStudent(studentName) {
    const allGrades = Store.grades;
    let filtered = allGrades;
    
    if (studentName) {
      filtered = allGrades.filter(g => {
        const student = Store.findStudent(s => s.id === g.studentId);
        return student && student.name.includes(studentName);
      });
    }

    const tbody = document.querySelector('#gradeTable tbody');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(grade => {
      const student = Store.findStudent(s => s.id === grade.studentId);
      return `
      <tr>
        <td>${student ? escapeHtml(student.studentId) : '-'}</td>
        <td>${student ? escapeHtml(student.name) : '-'}</td>
        <td>${student ? escapeHtml(student.className) : '-'}</td>
        <td>${escapeHtml(grade.subject)}</td>
        <td>${grade.score}</td>
        <td>${this.getGradeLevel(grade.score)}</td>
        <td>${formatDate(grade.examDate)}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${grade.id}">编辑</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${grade.id}">删除</button>
        </td>
      </tr>
    `}).join('');
  }
};

export default GradeModule;
