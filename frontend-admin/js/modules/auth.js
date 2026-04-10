/**
 * 认证模块 - Auth
 * 处理用户登录、注册、权限验证等功能
 */

import { userStore, setCurrentUser, getCurrentUser, getPermissions, getState, setState } from './store.js';
import { generateId } from './utils.js';
import { showToast } from '../components/toast.js';

// 模块名到权限键的映射
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

// 页面标题映射
const pageTitles = {
    'dashboard': '系统概览',
    'student-import': '模板导入',
    'student-add': '信息录入',
    'student-edit': '信息修改',
    'student-query': '信息查询',
    'health-record': '健康记录',
    'reward-record': '奖惩记录',
    'growth-record': '成长档案',
    'grade-import': '成绩导入',
    'grade-analysis': '成绩分析',
    'grade-trend': '趋势追踪',
    'grade-report': '统计报表',
    'user-manage': '用户管理',
    'permission': '权限管理'
};

// 切换登录/注册/忘记密码表单
function showForm(formType) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    const targetForm = document.getElementById(formType + '-form');
    if (targetForm) {
        targetForm.classList.add('active');
    }
}

// 用户登录
function login(username, password, role) {
    const user = userStore.getAll().find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
    );
    
    if (user) {
        setCurrentUser(user);
        
        // 更新UI
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        document.getElementById('current-user').textContent = user.username;
        document.getElementById('user-avatar-text').textContent = user.username.charAt(0).toUpperCase();
        
        // 根据角色显示/隐藏管理菜单
        const adminSection = document.getElementById('admin-section');
        if (adminSection) {
            adminSection.style.display = user.role === 'admin' ? 'block' : 'none';
        }
        
        // 应用权限控制到导航菜单
        applyPermissions(user.role);
        
        showToast('登录成功，欢迎回来！', 'success');
        return true;
    } else {
        showToast('用户名、密码或角色不匹配', 'error');
        return false;
    }
}

// 用户登出
function logout() {
    setCurrentUser(null);
    document.getElementById('main-system').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    
    // 清空表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
    
    showToast('已安全退出', 'info');
}

// 用户注册
function register(username, email, password, role) {
    if (userStore.getByUsername(username)) {
        showToast('用户名已存在', 'error');
        return false;
    }
    
    const newUser = {
        id: generateId(),
        username,
        email,
        password,
        role,
        status: 'active',
        createTime: new Date().toISOString().split('T')[0]
    };
    
    userStore.add(newUser);
    showToast('注册成功，请登录', 'success');
    showForm('login');
    return true;
}

// 忘记密码
function forgotPassword(email) {
    const user = userStore.getAll().find(u => u.email === email);
    if (user) {
        showToast('重置链接已发送到您的邮箱', 'success');
        showForm('login');
        return true;
    } else {
        showToast('该邮箱未注册', 'error');
        return false;
    }
}

// 检查当前用户是否有指定模块的权限
function hasPermission(moduleName) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const role = currentUser.role;
    const permKey = modulePermissionMap[moduleName];
    
    if (!permKey) return true;
    
    const permissions = getPermissions(role);
    return permissions[permKey] ?? false;
}

// 应用权限控制到导航菜单
function applyPermissions(role) {
    const permissions = getPermissions(role);
    
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

// 模块初始化映射（由app.js设置）
let moduleInitMap = {};

// 设置模块初始化映射
function setModuleInitMap(map) {
    moduleInitMap = map;
}

// 切换模块
function switchModule(moduleName, onSwitchCallback) {
    // 权限校验
    if (!hasPermission(moduleName)) {
        showToast('您没有访问该模块的权限', 'error');
        return false;
    }
    
    setState('currentModule', moduleName);
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.module === moduleName) {
            item.classList.add('active');
        }
    });
    
    // 更新内容区域
    document.querySelectorAll('.module-content').forEach(module => {
        module.classList.remove('active');
    });
    
    const targetModule = document.getElementById('module-' + moduleName);
    if (targetModule) {
        targetModule.classList.add('active');
    }
    
    // 更新页面标题
    const pageTitle = document.getElementById('current-page-title');
    if (pageTitle) {
        pageTitle.textContent = pageTitles[moduleName] || moduleName;
    }
    
    // 执行模块初始化
    if (moduleInitMap[moduleName]) {
        moduleInitMap[moduleName]();
    }
    
    // 执行回调
    if (onSwitchCallback) {
        onSwitchCallback(moduleName);
    }
    
    return true;
}

// 检查是否已登录
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// 获取当前用户角色
function getCurrentRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

// 初始化认证事件
function initAuthEvents() {
    // 登录表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;
            login(username, password, role);
        });
    }
    
    // 注册表单
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
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
            
            register(username, email, password, role);
        });
    }
    
    // 忘记密码表单
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            forgotPassword(email);
        });
    }
    
    // 导航切换
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.dataset.module;
            if (moduleName) {
                switchModule(moduleName);
            }
        });
    });
}

export {
    showForm,
    login,
    logout,
    register,
    forgotPassword,
    hasPermission,
    applyPermissions,
    switchModule,
    setModuleInitMap,
    isAuthenticated,
    getCurrentRole,
    initAuthEvents,
    modulePermissionMap,
    pageTitles
};
