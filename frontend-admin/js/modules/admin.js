import Store from './store.js';
import { generateId, showNotification, escapeHtml } from './utils.js';

const AdminModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => this.showUserForm());
    }

    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => this.handleUserSave(e));
    }

    document.getElementById('userTable')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        this.editUser(e.target.dataset.id);
      } else if (e.target.classList.contains('delete-btn')) {
        this.deleteUser(e.target.dataset.id);
      }
    });

    const permissionSave = document.getElementById('savePermissionBtn');
    if (permissionSave) {
      permissionSave.addEventListener('click', () => this.savePermissions());
    }
  },

  renderUserList() {
    const users = Store.users;
    const tbody = document.querySelector('#userTable tbody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(user.name)}</td>
        <td>${this.getRoleText(user.role)}</td>
        <td>
          <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}">
            ${user.status === 'active' ? '启用' : '禁用'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${user.id}">编辑</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">删除</button>
        </td>
      </tr>
    `).join('');
  },

  getRoleText(role) {
    const roles = { admin: '管理员', teacher: '教师', student: '学生' };
    return `<span class="badge bg-info">${roles[role] || role}</span>`;
  },

  showUserForm() {
    const form = document.getElementById('userForm');
    form.reset();
    document.getElementById('userModalTitle').textContent = '添加用户';
    document.getElementById('userModal').dataset.mode = 'add';
    document.getElementById('userModal').style.display = 'block';
  },

  editUser(id) {
    const user = Store.users.find(u => u.id === id);
    if (!user) return;

    document.getElementById('userModalTitle').textContent = '编辑用户';
    document.getElementById('userModal').dataset.mode = 'edit';
    document.getElementById('userModal').dataset.editId = id;
    document.getElementById('userUsername').value = user.username || '';
    document.getElementById('userName').value = user.name || '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = user.role || 'student';
    document.getElementById('userStatus').value = user.status || 'active';
    document.getElementById('userModal').style.display = 'block';
  },

  handleUserSave(e) {
    e.preventDefault();
    const modal = document.getElementById('userModal');
    const mode = modal.dataset.mode;
    const editId = modal.dataset.editId;

    const userData = {
      username: document.getElementById('userUsername').value,
      name: document.getElementById('userName').value,
      role: document.getElementById('userRole').value,
      status: document.getElementById('userStatus').value
    };

    const password = document.getElementById('userPassword').value;
    if (password) userData.password = password;

    if (mode === 'edit') {
      Store.updateUser(editId, userData);
      showNotification('用户信息更新成功', 'success');
    } else {
      userData.id = generateId();
      userData.password = userData.password || '123456';
      Store.addUser(userData);
      showNotification('用户创建成功，初始密码: 123456', 'success');
    }

    modal.style.display = 'none';
    this.renderUserList();
  },

  deleteUser(id) {
    if (confirm('确定要删除这个用户吗？')) {
      Store.deleteUser(id);
      showNotification('用户已删除', 'success');
      this.renderUserList();
    }
  },

  renderPermissionMatrix() {
    const roles = ['admin', 'teacher', 'student'];
    const permissions = Store.getPermissionKeys();
    const container = document.getElementById('permissionMatrix');
    if (!container) return;

    let html = '<table class="table table-bordered"><thead><tr><th>权限项</th>';
    roles.forEach(role => {
      html += `<th class="text-center">${this.getRoleText(role).replace(/<[^>]*>/g, '')}</th>`;
    });
    html += '</tr></thead><tbody>';

    permissions.forEach(permKey => {
      html += `<tr><td>${permKey}</td>`;
      roles.forEach(role => {
        const hasPerm = Store.hasPermission(role, permKey);
        html += `<td class="text-center">
          <input type="checkbox" class="permission-checkbox" 
            data-role="${role}" 
            data-permission="${permKey}" 
            ${hasPerm ? 'checked' : ''}>
        </td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  },

  savePermissions() {
    const checkboxes = document.querySelectorAll('#permissionMatrix .permission-checkbox:checked');
    const newPermissions = { admin: {}, teacher: {}, student: {} };
    
    checkboxes.forEach(cb => {
      const role = cb.dataset.role;
      const perm = cb.dataset.permission;
      newPermissions[role][perm] = true;
    });

    Object.keys(newPermissions).forEach(role => {
      Store.setRolePermissions(role, newPermissions[role]);
    });

    showNotification('权限配置已保存', 'success');
  },

  renderDashboardCharts() {
    this.renderGradeDistribution();
    this.renderStudentStats();
    this.renderRecentActivity();
  },

  renderGradeDistribution() {
    const grades = Store.grades;
    const ctx = document.getElementById('gradeDistributionChart');
    if (!ctx || typeof window.Chart === 'undefined') return;

    const ranges = { '优秀(90-100)': 0, '良好(80-89)': 0, '及格(60-79)': 0, '不及格(0-59)': 0 };
    
    grades.forEach(g => {
      if (g.score >= 90) ranges['优秀(90-100)']++;
      else if (g.score >= 80) ranges['良好(80-89)']++;
      else if (g.score >= 60) ranges['及格(60-79)']++;
      else ranges['不及格(0-59)']++;
    });

    if (Store.chartInstances.distribution) Store.chartInstances.distribution.destroy();
    
    Store.chartInstances.distribution = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(ranges),
        datasets: [{
          label: '人数',
          data: Object.values(ranges),
          backgroundColor: ['#27ae60', '#3498db', '#f39c12', '#e74c3c']
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { text: '成绩分布统计', display: true } }
      }
    });
  },

  renderStudentStats() {
    const ctx = document.getElementById('classDistributionChart');
    if (!ctx || typeof window.Chart === 'undefined') return;

    const students = Store.students;
    const classStats = {};
    students.forEach(s => {
      const className = s.className || '未知';
      classStats[className] = (classStats[className] || 0) + 1;
    });

    if (Store.chartInstances.classDist) Store.chartInstances.classDist.destroy();

    Store.chartInstances.classDist = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(classStats),
        datasets: [{
          data: Object.values(classStats),
          backgroundColor: ['#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c']
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { text: '班级人数分布', display: true } }
      }
    });

    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    document.getElementById('totalStudentCount').textContent = totalStudents;
    document.getElementById('activeStudentCount').textContent = activeStudents;
    document.getElementById('totalUserCount').textContent = Store.users.length;
    document.getElementById('totalGradeCount').textContent = Store.grades.length;
  },

  renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    const activities = [
      ...Store.grades.slice(-5).map(g => {
        const student = Store.findStudent(s => s.id === g.studentId);
        return {
          time: g.examDate,
          text: `成绩录入: ${student?.name || '未知'} - ${g.subject} ${g.score}分`,
          type: 'grade'
        };
      }),
      ...Store.students.slice(-3).map(s => ({
        time: s.enrollmentDate,
        text: `新学生入学: ${s.name}`,
        type: 'student'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    container.innerHTML = activities.map(a => `
      <div class="activity-item">
        <i class="fas fa-${a.type === 'grade' ? 'book-open' : 'user-plus'} text-${a.type === 'grade' ? 'info' : 'success'}"></i>
        <span>${a.text}</span>
        <small class="text-muted">${a.time}</small>
      </div>
    `).join('');
  }
};

export default AdminModule;
