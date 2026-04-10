/**
 * 管理员功能模块 - Admin
 * 处理用户管理、权限管理等功能
 */

import { userStore, getPermissions, getCurrentUser } from './store.js';
import { generateId } from './utils.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { showConfirm } from '../components/confirm.js';

// 加载用户列表
function loadUserList() {
    const tbody = document.getElementById('user-list');
    if (!tbody) return;
    
    tbody.innerHTML = userStore.getAll().map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教师' : '学生'}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'active' : 'inactive'}">${user.status === 'active' ? '正常' : '禁用'}</span></td>
            <td>${user.createTime}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="window.editUser(${user.id})">编辑</button>
                    <button class="btn-delete" onclick="window.deleteUser(${user.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 显示用户弹窗
function showUserModal(user = null) {
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
        <button class="btn btn-secondary" onclick="window.closeUserModal()">取消</button>
        <button class="btn btn-primary" onclick="window.saveUser()">保存</button>
    `);
}

// 保存用户
function saveUser() {
    const form = document.getElementById('user-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.id) {
        userStore.update(data.id, data);
    } else {
        data.id = generateId();
        data.createTime = new Date().toISOString().split('T')[0];
        userStore.add(data);
    }
    
    closeModal();
    loadUserList();
    showToast('保存成功！', 'success');
}

// 编辑用户
function editUser(id) {
    const user = userStore.getById(id);
    if (user) {
        showUserModal(user);
    }
}

// 删除用户
function deleteUser(id) {
    const currentUser = getCurrentUser();
    if (id == currentUser?.id) {
        showToast('不能删除当前登录的用户', 'error');
        return;
    }
    
    showConfirm('确定要删除该用户吗？', () => {
        if (userStore.delete(id)) {
            loadUserList();
            showToast('删除成功！', 'success');
        }
    });
}

// 加载权限配置
function loadPermissions(role) {
    const currentRoleName = document.getElementById('current-role-name');
    if (currentRoleName) {
        currentRoleName.textContent = role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学生';
    }
    
    const permissions = getPermissions(role);
    
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
    if (!container) return;
    
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

// 初始化管理员模块事件
function initAdminEvents() {
    // 角色切换
    document.querySelectorAll('.role-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.role-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            loadPermissions(this.dataset.role);
        });
    });
    
    // 暴露函数到全局
    window.showUserModal = () => showUserModal();
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.saveUser = saveUser;
    window.closeUserModal = closeModal;
    window.loadUserList = loadUserList;
    window.loadPermissions = loadPermissions;
}

export {
    loadUserList,
    showUserModal,
    saveUser,
    editUser,
    deleteUser,
    loadPermissions,
    initAdminEvents
};
