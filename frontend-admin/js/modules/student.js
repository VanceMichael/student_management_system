import Store from './store.js';
import { generateId, formatDate, showNotification, escapeHtml, calculateAge, exportToCSV, importFromCSV } from './utils.js';

const StudentModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const addStudentBtn = document.getElementById('addStudentBtn');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => this.showAddForm());
    }

    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => this.handleSave(e));
    }

    const importStudent = document.getElementById('importStudent');
    if (importStudent) {
      importStudent.addEventListener('change', (e) => this.handleImport(e));
    }

    const exportStudent = document.getElementById('exportStudent');
    if (exportStudent) {
      exportStudent.addEventListener('click', () => this.handleExport());
    }

    document.getElementById('studentTable')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        this.editStudent(e.target.dataset.id);
      } else if (e.target.classList.contains('delete-btn')) {
        this.deleteStudent(e.target.dataset.id);
      }
    });
  },

  renderList() {
    const students = Store.students;
    const tbody = document.querySelector('#studentTable tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
      <tr>
        <td>${escapeHtml(student.studentId)}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${student.gender}</td>
        <td>${calculateAge(student.birthDate)}</td>
        <td>${escapeHtml(student.className)}</td>
        <td>${formatDate(student.enrollmentDate)}</td>
        <td>
          <span class="badge ${student.status === 'active' ? 'bg-success' : 'bg-secondary'}">
            ${student.status === 'active' ? '在读' : '离校'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${student.id}">编辑</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  showAddForm() {
    const form = document.getElementById('studentForm');
    form.reset();
    document.getElementById('studentId').value = 'STU' + String(Store.students.length + 1001).padStart(4, '0');
    document.getElementById('studentModalTitle').textContent = '添加学生';
    document.getElementById('studentModal').dataset.mode = 'add';
    this.showModal();
  },

  editStudent(id) {
    const student = Store.findStudent(s => s.id === id);
    if (!student) return;

    document.getElementById('studentModalTitle').textContent = '编辑学生';
    document.getElementById('studentModal').dataset.mode = 'edit';
    document.getElementById('studentModal').dataset.editId = id;
    
    document.getElementById('studentId').value = student.studentId || '';
    document.getElementById('studentName').value = student.name || '';
    document.getElementById('studentGender').value = student.gender || '';
    document.getElementById('studentBirthDate').value = student.birthDate || '';
    document.getElementById('studentClass').value = student.className || '';
    document.getElementById('studentMajor').value = student.major || '';
    document.getElementById('studentEnrollment').value = student.enrollmentDate || '';
    document.getElementById('studentStatus').value = student.status || 'active';
    document.getElementById('studentContact').value = student.contact || '';
    document.getElementById('studentEmail').value = student.email || '';
    document.getElementById('studentAddress').value = student.address || '';

    this.showModal();
  },

  handleSave(e) {
    e.preventDefault();
    const modal = document.getElementById('studentModal');
    const mode = modal.dataset.mode;
    const editId = modal.dataset.editId;

    const studentData = {
      studentId: document.getElementById('studentId').value,
      name: document.getElementById('studentName').value,
      gender: document.getElementById('studentGender').value,
      birthDate: document.getElementById('studentBirthDate').value,
      className: document.getElementById('studentClass').value,
      major: document.getElementById('studentMajor').value,
      enrollmentDate: document.getElementById('studentEnrollment').value,
      status: document.getElementById('studentStatus').value,
      contact: document.getElementById('studentContact').value,
      email: document.getElementById('studentEmail').value,
      address: document.getElementById('studentAddress').value
    };

    if (mode === 'edit') {
      Store.updateStudent(editId, studentData);
      showNotification('学生信息更新成功', 'success');
    } else {
      studentData.id = generateId();
      Store.addStudent(studentData);
      showNotification('学生添加成功', 'success');
    }

    this.hideModal();
    this.renderList();
  },

  deleteStudent(id) {
    if (confirm('确定要删除这名学生吗？')) {
      Store.deleteStudent(id);
      showNotification('学生已删除', 'success');
      this.renderList();
    }
  },

  async handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const results = await importFromCSV(file, {
        '学号': 'studentId',
        '姓名': 'name',
        '性别': 'gender',
        '出生日期': 'birthDate',
        '班级': 'className'
      }, (obj) => {
        obj.id = generateId();
        obj.status = 'active';
      });

      results.forEach(student => Store.addStudent(student));
      showNotification(`成功导入 ${results.length} 名学生`, 'success');
      this.renderList();
    } catch (err) {
      showNotification('导入失败：' + err.message, 'error');
    }
    
    e.target.value = '';
  },

  exportStudents: async function() {
    const students = Store.students;
    const fields = ['studentId', 'name', 'gender', 'className', 'major', 'status'];
    exportToCSV(students, 'students.csv', fields);
  },

  handleExport() {
    this.exportStudents();
  },

  downloadTemplate() {
    const headers = ['studentId', 'name', 'gender', 'birthDate', 'className', 'major', 'dormitory'];
    exportToCSV([{ studentId: 'S001', name: '张三', gender: '男', birthDate: '2000-01-01', className: '一班', major: '计算机科学', dormitory: 'A101' }], 'student_template.csv', headers);
  },

  cancelImport() {
    document.getElementById('importModal').style.display = 'none';
  },

  confirmImport() {
    showNotification('数据已导入', 'success');
    document.getElementById('importModal').style.display = 'none';
  },

  searchStudentForEdit() {
    const keyword = document.getElementById('editSearchKeyword')?.value;
    if (keyword) this.searchStudents('name', keyword);
  },

  queryStudents() {
    this.renderList();
  },

  resetQuery() {
    document.getElementById('studentQueryForm')?.reset();
    this.renderList();
  },

  confirmDelete() {
    if (confirm('确定删除该学生吗？')) {
      showNotification('学生已删除', 'success');
    }
  },

  importStudents(file) {
    this.handleImport({ target: { files: [file], value: '' } });
  },

  showModal() {
    document.getElementById('studentModal').style.display = 'block';
  },

  hideModal() {
    document.getElementById('studentModal').style.display = 'none';
  },

  search(keyword) {
    if (!keyword) {
      this.renderList();
      return;
    }

    const students = Store.searchStudents(keyword);
    const tbody = document.querySelector('#studentTable tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
      <tr>
        <td>${escapeHtml(student.studentId)}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${student.gender}</td>
        <td>${calculateAge(student.birthDate)}</td>
        <td>${escapeHtml(student.className)}</td>
        <td>${formatDate(student.enrollmentDate)}</td>
        <td>
          <span class="badge ${student.status === 'active' ? 'bg-success' : 'bg-secondary'}">
            ${student.status === 'active' ? '在读' : '离校'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${student.id}">编辑</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  searchStudents(field, keyword) {
    this.search(keyword);
  }
};

export default StudentModule;
