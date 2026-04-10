import { AppState, MockData, getCurrentUser, getState } from './store/store.js';
import { showToast, showConfirm, openModal, closeModal, generateId, formatDate } from './utils.js';
import { applyPermissions } from './auth.js';

export function loadUserList() {
    const tbody = document.getElementById('user-list');
    tbody.innerHTML = AppState.users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教师' : '学生'}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'active' : 'inactive'}">${user.status === 'active' ? '正常' : '禁用'}</span></td>
            <td>${user.createTime}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editUser('${user.id}')">编辑</button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

export function showUserModal(user = null) {
    const isEdit = user !== null;
    openModal(isEdit ? '编辑用户' : '添加用户', `
        <form id="user-form" class="modal-form">
            <input type="hidden" name="id" value="${user?.id || ''}">
            <div class="form-group">
                <label>用户名</label>
                <input type="text" name="username" value="${user?.username || ''}" required ${isEdit ? 'readonly' : ''}>
            </div>
            <div class="form-group">
                <label>邮箱</label>
                <input type="email" name="email" value="${user?.email || ''}" required>
            </div>
            ${!isEdit ? `
            <div class="form-group">
                <label>密码</label>
                <input type="password" name="password" required>
            </div>
            ` : ''}
            <div class="form-group">
                <label>角色</label>
                <select name="role">
                    <option value="teacher" ${user?.role === 'teacher' ? 'selected' : ''}>教师</option>
                    <option value="student" ${user?.role === 'student' ? 'selected' : ''}>学生</option>
                    <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>管理员</option>
                </select>
            </div>
            <div class="form-group">
                <label>状态</label>
                <select name="status">
                    <option value="active" ${user?.status === 'active' ? 'selected' : ''}>正常</option>
                    <option value="inactive" ${user?.status === 'inactive' ? 'selected' : ''}>禁用</option>
                </select>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveUser()">保存</button>
    `);
}

export function saveUser() {
    const form = document.getElementById('user-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.id) {
        const index = AppState.users.findIndex(u => u.id == data.id);
        if (index !== -1) {
            AppState.users[index] = { ...AppState.users[index], ...data };
        }
    } else {
        data.id = generateId();
        data.createTime = new Date().toISOString().split('T')[0];
        AppState.users.push(data);
    }
    
    closeModal();
    loadUserList();
    showToast('保存成功！', 'success');
}

export function editUser(id) {
    const user = AppState.users.find(u => u.id == id);
    if (user) {
        showUserModal(user);
    }
}

export function deleteUser(id) {
    const currentUser = getCurrentUser();
    if (id == currentUser?.id) {
        showToast('不能删除当前登录的用户', 'error');
        return;
    }
    
    showConfirm('确定要删除该用户吗？', () => {
        const index = AppState.users.findIndex(u => u.id == id);
        if (index !== -1) {
            AppState.users.splice(index, 1);
            loadUserList();
            showToast('删除成功！', 'success');
        }
    });
}

export function loadPermissions(role) {
    document.getElementById('current-role-name').textContent = 
        role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学生';
    
    const permissions = MockData.permissions[role];
    const groups = [
        {
            name: '学生信息管理',
            items: [
                { key: 'studentImport', label: '模板导入' },
                { key: 'studentAdd', label: '信息录入' },
                { key: 'studentEdit', label: '信息修改' },
                { key: 'studentQuery', label: '信息查询' }
            ]
        },
        {
            name: '学生行为管理',
            items: [
                { key: 'healthRecord', label: '健康记录' },
                { key: 'rewardRecord', label: '奖惩记录' },
                { key: 'growthRecord', label: '成长档案' }
            ]
        },
        {
            name: '成绩管理',
            items: [
                { key: 'gradeImport', label: '成绩导入' },
                { key: 'gradeAnalysis', label: '成绩分析' },
                { key: 'gradeTrend', label: '趋势追踪' },
                { key: 'gradeReport', label: '统计报表' }
            ]
        },
        {
            name: '系统管理',
            items: [
                { key: 'userManage', label: '用户管理' },
                { key: 'permission', label: '权限管理' }
            ]
        }
    ];
    
    const container = document.getElementById('permission-groups');
    container.innerHTML = groups.map(group => `
        <div class="permission-group">
            <h5>${group.name}</h5>
            <div class="permission-items">
                ${group.items.map(item => `
                    <div class="permission-item">
                        <input type="checkbox" id="perm-${item.key}" ${permissions[item.key] ? 'checked' : ''} ${role === 'admin' ? 'disabled' : ''}>
                        <label for="perm-${item.key}">${item.label}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

export function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const importFile = document.getElementById('import-file');
    
    if (uploadArea && importFile) {
        uploadArea.addEventListener('click', () => importFile.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            handleFileUpload(e.dataTransfer.files[0]);
        });
        importFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    const gradeUploadArea = document.getElementById('grade-upload-area');
    const gradeImportFile = document.getElementById('grade-import-file');
    
    if (gradeUploadArea && gradeImportFile) {
        gradeUploadArea.addEventListener('click', () => gradeImportFile.click());
        gradeImportFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleGradeUpload(e.target.files[0]);
            }
        });
    }
}

export function handleFileUpload(file) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('请上传Excel文件', 'error');
        return;
    }
    
    showToast('文件上传成功，正在解析...', 'info');
    
    setTimeout(() => {
        document.getElementById('import-preview').style.display = 'block';
        const previewTable = document.getElementById('preview-table');
        previewTable.querySelector('thead').innerHTML = `
            <tr>
                <th>姓名</th>
                <th>性别</th>
                <th>出生日期</th>
                <th>民族</th>
                <th>籍贯</th>
                <th>身份证号</th>
            </tr>
        `;
        previewTable.querySelector('tbody').innerHTML = `
            <tr>
                <td>导入学生1</td>
                <td>男</td>
                <td>2015-01-01</td>
                <td>汉族</td>
                <td>北京市</td>
                <td>110101201501010001</td>
            </tr>
            <tr>
                <td>导入学生2</td>
                <td>女</td>
                <td>2015-02-15</td>
                <td>汉族</td>
                <td>上海市</td>
                <td>310101201502150002</td>
            </tr>
        `;
        showToast('解析完成，请预览确认', 'success');
    }, 1000);
}

export function handleGradeUpload(file) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('请上传Excel文件', 'error');
        return;
    }
    
    showToast('成绩文件上传成功，正在导入...', 'info');
    
    setTimeout(() => {
        showToast('成绩导入成功！', 'success');
    }, 1500);
}

export function cancelImport() {
    document.getElementById('import-preview').style.display = 'none';
    document.getElementById('import-file').value = '';
}

export function confirmImport() {
    showToast('正在导入数据...', 'info');
    
    setTimeout(() => {
        const newStudents = [
            { id: generateId(), name: '导入学生1', gender: '男', birthdate: '2015-01-01', ethnicity: '汉族', hometown: '北京市', idCard: '110101201501010001', className: '三年级一班', addTime: new Date().toISOString().split('T')[0] },
            { id: generateId(), name: '导入学生2', gender: '女', birthdate: '2015-02-15', ethnicity: '汉族', hometown: '上海市', idCard: '310101201502150002', className: '三年级一班', addTime: new Date().toISOString().split('T')[0] }
        ];
        
        AppState.students.push(...newStudents);
        
        document.getElementById('import-preview').style.display = 'none';
        document.getElementById('import-file').value = '';
        
        showToast('数据导入成功！共导入 2 条记录', 'success');
    }, 1500);
}

export function initEventBindings() {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;
            window.login(username, password, role);
        });
        
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            const role = document.getElementById('reg-role').value;
            
            if (password !== confirm) {
                showToast('两次密码输入不一致', 'error');
                return;
            }
            
            window.register(username, email, password, role);
        });
        
        document.getElementById('forgot-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            window.forgotPassword(email);
        });
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const moduleName = this.dataset.module;
                if (moduleName) {
                    window.switchModule(moduleName);
                }
            });
        });
        
        document.getElementById('student-add-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            if (window.addStudent(data)) {
                this.reset();
            }
        });
        
        document.getElementById('student-edit-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;
            delete data.id;
            window.updateStudent(id, data);
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                window.loadRewardRecords(this.dataset.tab);
            });
        });
        
        document.querySelectorAll('.role-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.role-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                loadPermissions(this.dataset.role);
            });
        });
        
        document.getElementById('modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        setupFileUpload();
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    });
}

window.loadUserList = loadUserList;
window.showUserModal = showUserModal;
window.saveUser = saveUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.loadPermissions = loadPermissions;
window.cancelImport = cancelImport;
window.confirmImport = confirmImport;
