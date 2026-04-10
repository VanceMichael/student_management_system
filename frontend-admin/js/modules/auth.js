import Store from './store.js';
import { showNotification } from './utils.js';

const Auth = {
  currentUser: null,

  init() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      Store.setCurrentUser(this.currentUser);
    }
    this.bindEvents();
  },

  bindEvents() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = Store.authenticateUser(username, password);
    
    if (user) {
      this.currentUser = user;
      Store.setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      showNotification(`欢迎回来，${user.name}！`, 'success');
      this.showMainSystem();
      this.updateUserUI();
    } else {
      showNotification('用户名或密码错误', 'error');
    }
  },

  logout() {
    this.currentUser = null;
    Store.setCurrentUser(null);
    localStorage.removeItem('currentUser');
    showNotification('已安全退出', 'success');
    this.showLoginPage();
  },

  showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainSystem').style.display = 'none';
  },

  showMainSystem() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainSystem').style.display = 'flex';
    this.updateUserUI();
    this.updateMenuVisibility();
  },

  updateUserUI() {
    const userInfo = document.getElementById('currentUserName');
    if (userInfo && this.currentUser) {
      userInfo.textContent = this.currentUser.name;
    }
    const userRole = document.getElementById('currentUserRole');
    if (userRole && this.currentUser) {
      userRole.textContent = this.currentUser.role === 'admin' ? '管理员' : this.currentUser.role === 'teacher' ? '教师' : '学生';
    }
  },

  updateMenuVisibility() {
    if (!this.currentUser) return;

    const menuItems = document.querySelectorAll('#sidebarMenu .menu-item[data-permission]');
    menuItems.forEach(item => {
      const permission = item.dataset.permission;
      const hasPermission = Store.hasPermission(this.currentUser.role, permission);
      item.style.display = hasPermission ? 'block' : 'none';
    });
  },

  checkAuth() {
    if (this.currentUser) {
      this.showMainSystem();
      return true;
    } else {
      this.showLoginPage();
      return false;
    }
  },

  isAuthenticated() {
    return !!this.currentUser;
  },

  getUser() {
    return this.currentUser;
  },

  hasPermission(permissionKey) {
    if (!this.currentUser) return false;
    return Store.hasPermission(this.currentUser.role, permissionKey);
  }
};

export default Auth;
