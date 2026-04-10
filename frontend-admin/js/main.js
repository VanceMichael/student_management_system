import Store from './modules/store.js';
import { generateId, formatDate, showNotification, exportToCSV, calculateAge } from './modules/utils.js';
import Auth from './modules/auth.js';
import StudentModule from './modules/student.js';
import BehaviorModule from './modules/behavior.js';
import GradeModule from './modules/grade.js';
import AdminModule from './modules/admin.js';
import TableComponent from './components/TableComponent.js';
import ModalComponent from './components/ModalComponent.js';
import FormComponent from './components/FormComponent.js';
import ChartComponent from './components/ChartComponent.js';

function initGlobalFunctions() {
    window.showForm = function(formType) {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => form.classList.remove('active'));
        
        const targetForm = document.getElementById(`${formType}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    };

    window.logout = function() {
        Auth.logout();
    };

    window.closeModal = ModalComponent.close;
    window.downloadTemplate = StudentModule.downloadTemplate;
    window.cancelImport = StudentModule.cancelImport;
    window.confirmImport = StudentModule.confirmImport;
    window.searchStudentForEdit = StudentModule.searchStudentForEdit;
    window.deleteStudent = StudentModule.confirmDelete;
    window.queryStudents = StudentModule.queryStudents;
    window.resetQuery = StudentModule.resetQuery;
    window.showHealthModal = BehaviorModule.showHealthModal;
    window.showRewardModal = BehaviorModule.showRewardModal;
    window.searchGrowthRecord = BehaviorModule.searchGrowthRecord;
    window.showGrowthModal = BehaviorModule.showGrowthModal;
    window.downloadGradeTemplate = GradeModule.downloadTemplate;
    window.loadStudentTrend = GradeModule.loadStudentTrend;
    window.generateReport = AdminModule.generateReport;
    window.exportReport = AdminModule.exportReport;
    window.showUserModal = AdminModule.showUserModal;
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const moduleName = this.dataset.module;
            if (!moduleName) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.module-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetModule = document.getElementById(`module-${moduleName}`);
            if (targetModule) {
                targetModule.classList.add('active');
            }

            const pageTitleMap = {
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
            
            document.getElementById('current-page-title').textContent = 
                pageTitleMap[moduleName] || moduleName;

            switch(moduleName) {
                case 'dashboard':
                    AdminModule.renderDashboardCharts();
                    updateDashboardStats();
                    break;
                case 'student-edit':
                case 'student-query':
                    StudentModule.renderList();
                    break;
                case 'grade-analysis':
                    GradeModule.renderCharts();
                    break;
                case 'user-manage':
                    AdminModule.renderUserList();
                    break;
                case 'permission':
                    AdminModule.renderPermissionMatrix();
                    break;
            }
        });
    });
}

function updateDashboardStats() {
    document.getElementById('total-students').textContent = Store.getStudents().length;
    document.getElementById('total-classes').textContent = Store.MockData.classes ? Store.MockData.classes.length : 3;
    document.getElementById('total-awards').textContent = 
        Store.getRewardRecords().filter(r => 
            new Date(r.date).getMonth() === new Date().getMonth()).length;
    
    const grades = Store.getGrades();
    if (grades.length > 0) {
        const avg = (grades.reduce((sum, g) => sum + (g.total || 0), 0) / grades.length).toFixed(1);
        document.getElementById('avg-score').textContent = avg;
    }

    const recentStudents = Store.getStudents().slice(-5).reverse();
    const recentTbody = document.getElementById('recent-students');
    recentTbody.innerHTML = recentStudents.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.gender}</td>
            <td>${s.className || '-'}</td>
            <td>${formatDate(s.addTime || s.createdAt || new Date())}</td>
        </tr>
    `).join('');
}

function initAuthForms() {
    Auth.init();
    
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;
        
        const user = Store.authenticateUser(username, password);
        if (user) {
            Auth.currentUser = user;
            Store.setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            showNotification(`欢迎回来，${user.username}！`, 'success');
            Auth.showMainSystem();
            Auth.updateUserUI();
        } else {
            showNotification('用户名或密码错误', 'error');
        }
    });

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const role = document.getElementById('reg-role').value;

        if (password !== confirm) {
            showNotification('两次密码不一致', 'error');
            return;
        }

        const newUser = {
            id: Store.MockData.users.length + 1,
            username,
            email,
            password,
            role,
            status: 'active',
            createTime: new Date().toISOString().split('T')[0]
        };
        Store.MockData.users.push(newUser);
        showNotification('注册成功！请登录', 'success');
        showForm('login');
    });

    document.getElementById('forgot-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('重置链接已发送到邮箱！', 'success');
    });
}

function initPageSpecificEvents() {
    const studentAddForm = document.getElementById('student-add-form');
    if (studentAddForm) {
        studentAddForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.age = calculateAge(data.birthday);
            data.createdAt = new Date().toISOString();
            
            if (StudentModule.addStudent(data)) {
                showNotification('学生信息录入成功！', 'success');
                this.reset();
            }
        });
    }

    const studentSearchBtn = document.getElementById('student-search-btn');
    if (studentSearchBtn) {
        studentSearchBtn.addEventListener('click', () => {
            const keyword = document.getElementById('student-search-keyword').value;
            const field = document.getElementById('student-search-field').value;
            StudentModule.searchStudents(field, keyword);
        });
    }

    const studentExportBtn = document.getElementById('student-export-btn');
    if (studentExportBtn) {
        studentExportBtn.addEventListener('click', StudentModule.exportStudents);
    }
}

function initUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const importFile = document.getElementById('import-file');
    
    if (uploadArea && importFile) {
        uploadArea.addEventListener('click', () => importFile.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                StudentModule.importStudents(files[0]);
            }
        });
        importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                StudentModule.importStudents(e.target.files[0]);
            }
        });
    }
}

function initAll() {
    initGlobalFunctions();
    initNavigation();
    initAuthForms();
    
    if (Auth.currentUser) {
        StudentModule.init();
        BehaviorModule.init();
        GradeModule.init();
        AdminModule.init();
        initPageSpecificEvents();
        initUploadArea();
        updateDashboardStats();
        AdminModule.renderDashboardCharts();
    }
}

document.addEventListener('DOMContentLoaded', initAll);

window.TableComponent = TableComponent;
window.ModalComponent = ModalComponent;
window.FormComponent = FormComponent;
window.ChartComponent = ChartComponent;
window.Store = Store;
window.Auth = Auth;
window.StudentModule = StudentModule;
window.BehaviorModule = BehaviorModule;
window.GradeModule = GradeModule;
window.AdminModule = AdminModule;
