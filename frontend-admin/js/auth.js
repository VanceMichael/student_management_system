import { showToast } from './utils.js';

const modulePermissionMap = {
    'dashboard': 'dashboard',
    'student-import': 'studentImport',
    'student-add': 'studentAdd',
    'student-edit': 'studentEdit',
    'student-query': 'studentQuery',
    'health-record': 'healthRecord',
    'reward-record': 'rewardRecord',
    'growth-record': 'growthRecord',
    'grade-import': 'gradeImport',
    'grade-analysis': 'gradeAnalysis',
    'grade-trend': 'gradeTrend',
    'grade-report': 'gradeReport',
    'user-manage': 'userManage',
    'permission': 'permission'
};

export function showForm(formType) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formType + '-form').classList.add('active');
}

export function login(username, password, role) {
    const Store = window.Store;
    const user = Store.getState().users.find(u => u.username === username && u.password === password && u.role === role);
    
    if (user) {
        Store.setCurrentUser(user);
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        document.getElementById('current-user').textContent = user.username;
        document.getElementById('user-avatar-text').textContent = user.username.charAt(0).toUpperCase();
        
        if (user.role !== 'admin') {
            document.getElementById('admin-section').style.display = 'none';
        } else {
            document.getElementById('admin-section').style.display = 'block';
        }
        
        applyPermissions(user.role);
        
        window.initDashboard();
        showToast('登录成功，欢迎回来！', 'success');
    } else {
        showToast('用户名、密码或角色不匹配', 'error');
    }
}

export function logout() {
    const Store = window.Store;
    Store.setCurrentUser(null);
    document.getElementById('main-system').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showToast('已安全退出', 'info');
}

export function register(username, email, password, role) {
    const Store = window.Store;
    
    if (Store.getState().users.find(u => u.username === username)) {
        showToast('用户名已存在', 'error');
        return false;
    }
    
    Store.addUser({
        username,
        email,
        password,
        role,
        status: 'active',
        createTime: new Date().toISOString().split('T')[0]
    });
    
    showToast('注册成功，请登录', 'success');
    showForm('login');
    return true;
}

export function forgotPassword(email) {
    const Store = window.Store;
    const user = Store.getState().users.find(u => u.email === email);
    if (user) {
        showToast('重置链接已发送到您的邮箱', 'success');
        showForm('login');
    } else {
        showToast('该邮箱未注册', 'error');
    }
}

export function hasPermission(moduleName) {
    const Store = window.Store;
    return Store.hasPermission(moduleName);
}

export function applyPermissions(role) {
    const Store = window.Store;
    const permissions = Store.getPermissions(role);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const moduleName = item.dataset.module;
        const permKey = modulePermissionMap[moduleName];
        
        if (permKey && !permissions[permKey]) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });
}

window.showForm = showForm;
window.login = login;
window.logout = logout;
window.register = register;
window.forgotPassword = forgotPassword;
window.hasPermission = hasPermission;
window.applyPermissions = applyPermissions;