/**
 * 学生信息管理系统 - 主应用逻辑
 */

// ========================================
// 全局变量和状态管理
// ========================================
const AppState = {
    currentUser: null,
    currentModule: 'dashboard',
    students: [],
    grades: [],
    healthRecords: [],
    rewardRecords: [],
    growthRecords: [],
    users: [],
    chartInstances: {}
};

// ========================================
// 模拟数据
// ========================================
const MockData = {
    users: [
        { id: 1, username: 'admin', password: '123456', email: 'admin@school.com', role: 'admin', status: 'active', createTime: '2024-01-01' },
        { id: 2, username: 'teacher1', password: '123456', email: 'teacher1@school.com', role: 'teacher', status: 'active', createTime: '2024-01-15' },
        { id: 3, username: 'student1', password: '123456', email: 'student1@school.com', role: 'student', status: 'active', createTime: '2024-02-01' }
    ],
    
    students: [
        { id: 1, name: '张三', gender: '男', birthdate: '2015-03-15', ethnicity: '汉族', hometown: '北京市', idCard: '110101201503150011', phone: '13800138001', address: '北京市朝阳区xx街道', fatherName: '张父', fatherJob: '工程师', fatherPhone: '13900139001', motherName: '张母', motherJob: '教师', motherPhone: '13900139002', reorganizedFamily: '否', leftBehindChild: '否', medicalHistory: '无', className: '三年级一班', addTime: '2024-01-10' },
        { id: 2, name: '李四', gender: '女', birthdate: '2015-06-20', ethnicity: '汉族', hometown: '上海市', idCard: '310101201506200022', phone: '13800138002', address: '上海市浦东新区xx路', fatherName: '李父', fatherJob: '医生', fatherPhone: '13900139003', motherName: '李母', motherJob: '会计', motherPhone: '13900139004', reorganizedFamily: '否', leftBehindChild: '否', medicalHistory: '无', className: '三年级一班', addTime: '2024-01-12' },
        { id: 3, name: '王五', gender: '男', birthdate: '2015-09-08', ethnicity: '满族', hometown: '辽宁省', idCard: '210101201509080033', phone: '13800138003', address: '辽宁省沈阳市xx区', fatherName: '王父', fatherJob: '商人', fatherPhone: '13900139005', motherName: '王母', motherJob: '护士', motherPhone: '13900139006', reorganizedFamily: '是', leftBehindChild: '否', medicalHistory: '轻度近视', className: '三年级二班', addTime: '2024-01-15' },
        { id: 4, name: '赵六', gender: '女', birthdate: '2015-12-01', ethnicity: '汉族', hometown: '广东省', idCard: '440101201512010044', phone: '13800138004', address: '广东省广州市xx区', fatherName: '赵父', fatherJob: '公务员', fatherPhone: '13900139007', motherName: '赵母', motherJob: '自由职业', motherPhone: '13900139008', reorganizedFamily: '否', leftBehindChild: '是', medicalHistory: '无', className: '三年级二班', addTime: '2024-01-18' },
        { id: 5, name: '钱七', gender: '男', birthdate: '2015-04-25', ethnicity: '汉族', hometown: '江苏省', idCard: '320101201504250055', phone: '13800138005', address: '江苏省南京市xx区', fatherName: '钱父', fatherJob: '律师', fatherPhone: '13900139009', motherName: '钱母', motherJob: '银行职员', motherPhone: '13900139010', reorganizedFamily: '否', leftBehindChild: '否', medicalHistory: '无', className: '三年级一班', addTime: '2024-01-20' }
    ],
    
    healthRecords: [
        { id: 1, studentId: 1, studentName: '张三', checkDate: '2024-03-15', height: 135, weight: 30, visionLeft: '5.0', visionRight: '5.0', status: '良好', notes: '身体健康' },
        { id: 2, studentId: 2, studentName: '李四', checkDate: '2024-03-15', height: 132, weight: 28, visionLeft: '4.9', visionRight: '5.0', status: '良好', notes: '身体健康' },
        { id: 3, studentId: 3, studentName: '王五', checkDate: '2024-03-15', height: 138, weight: 32, visionLeft: '4.6', visionRight: '4.7', status: '一般', notes: '建议复查视力' }
    ],
    
    rewardRecords: [
        { id: 1, studentId: 1, studentName: '张三', type: 'reward', date: '2024-03-10', reason: '期末考试成绩优异', level: '校级', recorder: '班主任' },
        { id: 2, studentId: 2, studentName: '李四', type: 'reward', date: '2024-03-08', reason: '参加绘画比赛获一等奖', level: '市级', recorder: '班主任' },
        { id: 3, studentId: 3, studentName: '王五', type: 'punishment', date: '2024-02-20', reason: '上课讲话影响课堂秩序', level: '班级', recorder: '班主任' }
    ],
    
    growthRecords: [
        { id: 1, studentId: 1, studentName: '张三', date: '2024-03-15', title: '担任班级学习委员', content: '张三同学在本学期被选为班级学习委员，表现出色，积极帮助同学解决学习问题。' },
        { id: 2, studentId: 1, studentName: '张三', date: '2024-02-20', title: '参加数学竞赛', content: '参加校级数学竞赛，获得二等奖，展现了良好的数学思维能力。' },
        { id: 3, studentId: 1, studentName: '张三', date: '2024-01-10', title: '入学记录', content: '张三同学正式入学，分配到三年级一班。' }
    ],
    
    exams: [
        { id: 1, name: '2024年春季期中考试', date: '2024-04-15', type: '期中' },
        { id: 2, name: '2024年春季期末考试', date: '2024-07-01', type: '期末' },
        { id: 3, name: '2024年秋季期中考试', date: '2024-11-15', type: '期中' }
    ],
    
    grades: [
        { studentId: 1, examId: 1, chinese: 95, math: 98, english: 92, physics: 88, chemistry: 90, total: 463, rank: 1 },
        { studentId: 2, examId: 1, chinese: 88, math: 92, english: 95, physics: 85, chemistry: 88, total: 448, rank: 2 },
        { studentId: 3, examId: 1, chinese: 78, math: 85, english: 80, physics: 75, chemistry: 78, total: 396, rank: 3 },
        { studentId: 4, examId: 1, chinese: 82, math: 78, english: 85, physics: 80, chemistry: 82, total: 407, rank: 4 },
        { studentId: 5, examId: 1, chinese: 90, math: 95, english: 88, physics: 92, chemistry: 94, total: 459, rank: 5 },
        { studentId: 1, examId: 2, chinese: 92, math: 96, english: 94, physics: 90, chemistry: 92, total: 464, rank: 1 },
        { studentId: 2, examId: 2, chinese: 90, math: 94, english: 96, physics: 88, chemistry: 90, total: 458, rank: 2 },
        { studentId: 3, examId: 2, chinese: 80, math: 88, english: 82, physics: 78, chemistry: 80, total: 408, rank: 3 },
        { studentId: 1, examId: 3, chinese: 94, math: 99, english: 93, physics: 91, chemistry: 93, total: 470, rank: 1 },
        { studentId: 2, examId: 3, chinese: 92, math: 95, english: 97, physics: 89, chemistry: 91, total: 464, rank: 2 }
    ],
    
    permissions: {
        admin: {
            dashboard: true,
            studentImport: true,
            studentAdd: true,
            studentEdit: true,
            studentQuery: true,
            healthRecord: true,
            rewardRecord: true,
            growthRecord: true,
            gradeImport: true,
            gradeAnalysis: true,
            gradeTrend: true,
            gradeReport: true,
            userManage: true,
            permission: true
        },
        teacher: {
            dashboard: true,
            studentImport: true,
            studentAdd: true,
            studentEdit: true,
            studentQuery: true,
            healthRecord: true,
            rewardRecord: true,
            growthRecord: true,
            gradeImport: true,
            gradeAnalysis: true,
            gradeTrend: true,
            gradeReport: true,
            userManage: false,
            permission: false
        },
        student: {
            dashboard: true,
            studentImport: false,
            studentAdd: false,
            studentEdit: false,
            studentQuery: true,
            healthRecord: true,
            rewardRecord: true,
            growthRecord: true,
            gradeImport: false,
            gradeAnalysis: true,
            gradeTrend: true,
            gradeReport: true,
            userManage: false,
            permission: false
        }
    }
};

// 初始化数据
AppState.students = [...MockData.students];
AppState.users = [...MockData.users];
AppState.healthRecords = [...MockData.healthRecords];
AppState.rewardRecords = [...MockData.rewardRecords];
AppState.growthRecords = [...MockData.growthRecords];
AppState.grades = [...MockData.grades];

// ========================================
// 工具函数
// ========================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 自定义确认对话框
function showConfirm(message, onConfirm, onCancel = null) {
    openModal('确认操作', `
        <div class="confirm-dialog">
            <div class="confirm-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#ed8936" stroke-width="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="#ed8936" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#ed8936"/>
                </svg>
            </div>
            <p class="confirm-message">${message}</p>
        </div>
    `, `
        <button class="btn btn-secondary" onclick="handleConfirmCancel()">取消</button>
        <button class="btn btn-danger" onclick="handleConfirmOk()">确定</button>
    `);
    
    // 存储回调函数
    window._confirmCallback = onConfirm;
    window._cancelCallback = onCancel;
}

function handleConfirmOk() {
    closeModal();
    if (window._confirmCallback) {
        window._confirmCallback();
        window._confirmCallback = null;
    }
}

function handleConfirmCancel() {
    closeModal();
    if (window._cancelCallback) {
        window._cancelCallback();
        window._cancelCallback = null;
    }
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN');
}

function generateId() {
    // 生成纯数字ID，避免onclick绑定时字符串解析问题
    return Date.now() + Math.floor(Math.random() * 10000);
}

// ========================================
// 认证相关函数
// ========================================
function showForm(formType) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formType + '-form').classList.add('active');
}

function login(username, password, role) {
    // 验证用户名、密码和角色
    const user = AppState.users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
        AppState.currentUser = user;
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        document.getElementById('current-user').textContent = user.username;
        document.getElementById('user-avatar-text').textContent = user.username.charAt(0).toUpperCase();
        
        // 根据角色显示/隐藏管理菜单
        if (user.role !== 'admin') {
            document.getElementById('admin-section').style.display = 'none';
        } else {
            document.getElementById('admin-section').style.display = 'block';
        }
        
        // 应用权限控制到导航菜单
        applyPermissions(user.role);
        
        initDashboard();
        showToast('登录成功，欢迎回来！', 'success');
    } else {
        showToast('用户名、密码或角色不匹配', 'error');
    }
}

function logout() {
    AppState.currentUser = null;
    document.getElementById('main-system').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showToast('已安全退出', 'info');
}

function register(username, email, password, role) {
    if (AppState.users.find(u => u.username === username)) {
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
    
    AppState.users.push(newUser);
    showToast('注册成功，请登录', 'success');
    showForm('login');
    return true;
}

function forgotPassword(email) {
    const user = AppState.users.find(u => u.email === email);
    if (user) {
        showToast('重置链接已发送到您的邮箱', 'success');
        showForm('login');
    } else {
        showToast('该邮箱未注册', 'error');
    }
}

// ========================================
// 权限控制
// ========================================
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

// 检查当前用户是否有指定模块的权限
function hasPermission(moduleName) {
    if (!AppState.currentUser) return false;
    const role = AppState.currentUser.role;
    const permKey = modulePermissionMap[moduleName];
    if (!permKey) return true;
    return MockData.permissions[role]?.[permKey] ?? false;
}

// 应用权限控制到导航菜单
function applyPermissions(role) {
    const permissions = MockData.permissions[role];
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

// ========================================
// 模块切换
// ========================================
function switchModule(moduleName) {
    // 权限校验
    if (!hasPermission(moduleName)) {
        showToast('您没有访问该模块的权限', 'error');
        return;
    }
    
    AppState.currentModule = moduleName;
    
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
    const titles = {
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
    document.getElementById('current-page-title').textContent = titles[moduleName] || moduleName;
    
    // 初始化模块数据
    initModuleData(moduleName);
}

function initModuleData(moduleName) {
    switch (moduleName) {
        case 'dashboard':
            initDashboard();
            break;
        case 'student-query':
            loadStudentList();
            break;
        case 'health-record':
            loadHealthRecords();
            break;
        case 'reward-record':
            loadRewardRecords();
            break;
        case 'grade-analysis':
            loadGradeAnalysis();
            break;
        case 'grade-report':
            generateReport();
            break;
        case 'user-manage':
            loadUserList();
            break;
        case 'permission':
            loadPermissions('admin');
            break;
    }
}

// ========================================
// 仪表板
// ========================================
function initDashboard() {
    // 更新统计数据
    document.getElementById('total-students').textContent = AppState.students.length;
    document.getElementById('total-classes').textContent = [...new Set(AppState.students.map(s => s.className))].length;
    document.getElementById('total-awards').textContent = AppState.rewardRecords.filter(r => r.type === 'reward').length;
    
    // 计算平均成绩
    const latestGrades = AppState.grades.filter(g => g.examId === 1);
    const avgScore = latestGrades.length > 0 
        ? (latestGrades.reduce((sum, g) => sum + g.total, 0) / latestGrades.length / 5).toFixed(1)
        : 0;
    document.getElementById('avg-score').textContent = avgScore;
    
    // 加载最近添加的学生
    loadRecentStudents();
    
    // 初始化图表
    initDashboardCharts();
}

function loadRecentStudents() {
    const tbody = document.getElementById('recent-students');
    const recentStudents = AppState.students.slice(-5).reverse();
    
    tbody.innerHTML = recentStudents.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.className}</td>
            <td>${student.addTime}</td>
        </tr>
    `).join('');
}

function initDashboardCharts() {
    // 销毁已存在的图表
    if (AppState.chartInstances.gradeDistChart) {
        AppState.chartInstances.gradeDistChart.destroy();
    }
    if (AppState.chartInstances.classChart) {
        AppState.chartInstances.classChart.destroy();
    }
    
    // 成绩分布图
    const gradeDistCtx = document.getElementById('gradeDistChart');
    if (gradeDistCtx) {
        AppState.chartInstances.gradeDistChart = new Chart(gradeDistCtx, {
            type: 'doughnut',
            data: {
                labels: ['优秀(90+)', '良好(80-89)', '及格(60-79)', '不及格(<60)'],
                datasets: [{
                    data: [35, 40, 20, 5],
                    backgroundColor: ['#48bb78', '#4299e1', '#ed8936', '#f56565'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // 班级人数图
    const classCtx = document.getElementById('classChart');
    if (classCtx) {
        const classData = {};
        AppState.students.forEach(s => {
            classData[s.className] = (classData[s.className] || 0) + 1;
        });
        
        AppState.chartInstances.classChart = new Chart(classCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(classData),
                datasets: [{
                    label: '学生人数',
                    data: Object.values(classData),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// ========================================
// 学生信息管理
// ========================================
function downloadTemplate() {
    // 模拟下载模板
    showToast('模板下载中...', 'info');
    setTimeout(() => {
        showToast('模板下载成功！', 'success');
    }, 1000);
}

function addStudent(formData) {
    const student = {
        id: generateId(),
        ...formData,
        className: '三年级一班',
        addTime: new Date().toISOString().split('T')[0]
    };
    
    AppState.students.push(student);
    showToast('学生信息添加成功！', 'success');
    return true;
}

function updateStudent(id, formData) {
    const index = AppState.students.findIndex(s => s.id == id);
    if (index !== -1) {
        AppState.students[index] = { ...AppState.students[index], ...formData };
        showToast('学生信息更新成功！', 'success');
        return true;
    }
    return false;
}

function deleteStudent() {
    const form = document.getElementById('student-edit-form');
    const id = form.querySelector('[name="id"]').value;
    
    showConfirm('确定要删除该学生信息吗？此操作不可恢复。', () => {
        const index = AppState.students.findIndex(s => s.id == id);
        if (index !== -1) {
            AppState.students.splice(index, 1);
            showToast('学生信息已删除', 'success');
            document.getElementById('edit-result').style.display = 'none';
        }
    });
}

function searchStudentForEdit() {
    const keyword = document.getElementById('edit-search').value.trim();
    if (!keyword) {
        showToast('请输入搜索关键词', 'warning');
        return;
    }
    
    const student = AppState.students.find(s => 
        s.name.includes(keyword) || s.idCard.includes(keyword)
    );
    
    if (student) {
        fillEditForm(student);
        document.getElementById('edit-result').style.display = 'block';
    } else {
        showToast('未找到匹配的学生', 'warning');
        document.getElementById('edit-result').style.display = 'none';
    }
}

function fillEditForm(student) {
    const form = document.getElementById('student-edit-form');
    Object.keys(student).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = student[key];
        }
    });
}

function loadStudentList(filters = {}) {
    let students = [...AppState.students];
    
    // 应用筛选条件
    if (filters.name) {
        students = students.filter(s => s.name.includes(filters.name));
    }
    if (filters.gender) {
        students = students.filter(s => s.gender === filters.gender);
    }
    if (filters.ethnicity) {
        students = students.filter(s => s.ethnicity === filters.ethnicity);
    }
    if (filters.leftBehind) {
        students = students.filter(s => s.leftBehindChild === filters.leftBehind);
    }
    
    const tbody = document.getElementById('student-list');
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.birthdate}</td>
            <td>${student.ethnicity}</td>
            <td>${student.hometown}</td>
            <td>${student.phone || '-'}</td>
            <td>${student.leftBehindChild}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" onclick="viewStudent('${student.id}')">查看</button>
                    <button class="btn-edit" onclick="editStudent('${student.id}')">编辑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function queryStudents() {
    const filters = {
        name: document.getElementById('query-name').value,
        gender: document.getElementById('query-gender').value,
        ethnicity: document.getElementById('query-ethnicity').value,
        leftBehind: document.getElementById('query-leftBehind').value
    };
    loadStudentList(filters);
}

function resetQuery() {
    document.getElementById('query-name').value = '';
    document.getElementById('query-gender').value = '';
    document.getElementById('query-ethnicity').value = '';
    document.getElementById('query-leftBehind').value = '';
    loadStudentList();
}

function viewStudent(id) {
    const student = AppState.students.find(s => s.id == id);
    if (student) {
        openModal('学生详细信息', `
            <div class="student-detail">
                <div class="detail-section">
                    <h4>基本信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><label>姓名:</label><span>${student.name}</span></div>
                        <div class="detail-item"><label>性别:</label><span>${student.gender}</span></div>
                        <div class="detail-item"><label>出生日期:</label><span>${student.birthdate}</span></div>
                        <div class="detail-item"><label>民族:</label><span>${student.ethnicity}</span></div>
                        <div class="detail-item"><label>籍贯:</label><span>${student.hometown}</span></div>
                        <div class="detail-item"><label>身份证号:</label><span>${student.idCard}</span></div>
                        <div class="detail-item"><label>联系电话:</label><span>${student.phone || '-'}</span></div>
                        <div class="detail-item"><label>家庭住址:</label><span>${student.address || '-'}</span></div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>家庭信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><label>父亲姓名:</label><span>${student.fatherName || '-'}</span></div>
                        <div class="detail-item"><label>父亲职业:</label><span>${student.fatherJob || '-'}</span></div>
                        <div class="detail-item"><label>父亲电话:</label><span>${student.fatherPhone || '-'}</span></div>
                        <div class="detail-item"><label>母亲姓名:</label><span>${student.motherName || '-'}</span></div>
                        <div class="detail-item"><label>母亲职业:</label><span>${student.motherJob || '-'}</span></div>
                        <div class="detail-item"><label>母亲电话:</label><span>${student.motherPhone || '-'}</span></div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>其他信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><label>是否重组家庭:</label><span>${student.reorganizedFamily}</span></div>
                        <div class="detail-item"><label>是否留守儿童:</label><span>${student.leftBehindChild}</span></div>
                        <div class="detail-item"><label>疾病史:</label><span>${student.medicalHistory || '无'}</span></div>
                    </div>
                </div>
            </div>
        `);
    }
}

function editStudent(id) {
    const student = AppState.students.find(s => s.id == id);
    if (student) {
        switchModule('student-edit');
        document.getElementById('edit-search').value = student.name;
        fillEditForm(student);
        document.getElementById('edit-result').style.display = 'block';
    }
}

// ========================================
// 健康记录管理
// ========================================
function loadHealthRecords() {
    const tbody = document.getElementById('health-list');
    tbody.innerHTML = AppState.healthRecords.map(record => `
        <tr>
            <td>${record.studentName}</td>
            <td>${record.checkDate}</td>
            <td>${record.height}</td>
            <td>${record.weight}</td>
            <td>${record.visionLeft}/${record.visionRight}</td>
            <td><span class="status-badge ${record.status === '良好' ? 'active' : ''}">${record.status}</span></td>
            <td>${record.notes}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editHealthRecord('${record.id}')">编辑</button>
                    <button class="btn-delete" onclick="deleteHealthRecord('${record.id}')">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showHealthModal(record = null) {
    const isEdit = record !== null;
    openModal(isEdit ? '编辑健康记录' : '添加健康记录', `
        <form id="health-form" class="modal-form">
            <input type="hidden" name="id" value="${record?.id || ''}">
            <div class="form-group">
                <label>学生姓名</label>
                <select name="studentId" required>
                    <option value="">请选择学生</option>
                    ${AppState.students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>检查日期</label>
                <input type="date" name="checkDate" value="${record?.checkDate || ''}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>身高(cm)</label>
                    <input type="number" name="height" value="${record?.height || ''}" required>
                </div>
                <div class="form-group">
                    <label>体重(kg)</label>
                    <input type="number" name="weight" value="${record?.weight || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>左眼视力</label>
                    <input type="text" name="visionLeft" value="${record?.visionLeft || ''}" placeholder="如: 5.0">
                </div>
                <div class="form-group">
                    <label>右眼视力</label>
                    <input type="text" name="visionRight" value="${record?.visionRight || ''}" placeholder="如: 5.0">
                </div>
            </div>
            <div class="form-group">
                <label>健康状况</label>
                <select name="status">
                    <option value="良好" ${record?.status === '良好' ? 'selected' : ''}>良好</option>
                    <option value="一般" ${record?.status === '一般' ? 'selected' : ''}>一般</option>
                    <option value="较差" ${record?.status === '较差' ? 'selected' : ''}>较差</option>
                </select>
            </div>
            <div class="form-group">
                <label>备注</label>
                <textarea name="notes" rows="3">${record?.notes || ''}</textarea>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveHealthRecord()">保存</button>
    `);
}

function saveHealthRecord() {
    const form = document.getElementById('health-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const student = AppState.students.find(s => s.id == data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        // 更新
        const index = AppState.healthRecords.findIndex(r => r.id == data.id);
        if (index !== -1) {
            AppState.healthRecords[index] = { ...AppState.healthRecords[index], ...data };
        }
    } else {
        // 新增
        data.id = generateId();
        AppState.healthRecords.push(data);
    }
    
    closeModal();
    loadHealthRecords();
    showToast('保存成功！', 'success');
}

function editHealthRecord(id) {
    const record = AppState.healthRecords.find(r => r.id == id);
    if (record) {
        showHealthModal(record);
    }
}

function deleteHealthRecord(id) {
    showConfirm('确定要删除该健康记录吗？', () => {
        const index = AppState.healthRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.healthRecords.splice(index, 1);
            loadHealthRecords();
            showToast('删除成功！', 'success');
        }
    });
}

// ========================================
// 奖惩记录管理
// ========================================
function loadRewardRecords(filter = 'all') {
    let records = [...AppState.rewardRecords];
    
    if (filter !== 'all') {
        records = records.filter(r => r.type === filter);
    }
    
    const tbody = document.getElementById('reward-list');
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.studentName}</td>
            <td><span class="status-badge ${record.type}">${record.type === 'reward' ? '奖励' : '惩罚'}</span></td>
            <td>${record.date}</td>
            <td>${record.reason}</td>
            <td>${record.level}</td>
            <td>${record.recorder}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editRewardRecord('${record.id}')">编辑</button>
                    <button class="btn-delete" onclick="deleteRewardRecord('${record.id}')">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showRewardModal(type, record = null) {
    const isEdit = record !== null;
    const recordType = isEdit ? record.type : type;
    
    openModal(isEdit ? '编辑记录' : (recordType === 'reward' ? '添加奖励' : '添加惩罚'), `
        <form id="reward-form" class="modal-form">
            <input type="hidden" name="id" value="${record?.id || ''}">
            <input type="hidden" name="type" value="${recordType}">
            <div class="form-group">
                <label>学生姓名</label>
                <select name="studentId" required>
                    <option value="">请选择学生</option>
                    ${AppState.students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>日期</label>
                <input type="date" name="date" value="${record?.date || ''}" required>
            </div>
            <div class="form-group">
                <label>原因</label>
                <textarea name="reason" rows="3" required>${record?.reason || ''}</textarea>
            </div>
            <div class="form-group">
                <label>级别</label>
                <select name="level">
                    <option value="班级" ${record?.level === '班级' ? 'selected' : ''}>班级</option>
                    <option value="校级" ${record?.level === '校级' ? 'selected' : ''}>校级</option>
                    <option value="区级" ${record?.level === '区级' ? 'selected' : ''}>区级</option>
                    <option value="市级" ${record?.level === '市级' ? 'selected' : ''}>市级</option>
                </select>
            </div>
            <div class="form-group">
                <label>记录人</label>
                <input type="text" name="recorder" value="${record?.recorder || AppState.currentUser?.username || ''}" required>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveRewardRecord()">保存</button>
    `);
}

function saveRewardRecord() {
    const form = document.getElementById('reward-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const student = AppState.students.find(s => s.id == data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        const index = AppState.rewardRecords.findIndex(r => r.id == data.id);
        if (index !== -1) {
            AppState.rewardRecords[index] = { ...AppState.rewardRecords[index], ...data };
        }
    } else {
        data.id = generateId();
        AppState.rewardRecords.push(data);
    }
    
    closeModal();
    loadRewardRecords();
    showToast('保存成功！', 'success');
}

function editRewardRecord(id) {
    const record = AppState.rewardRecords.find(r => r.id == id);
    if (record) {
        showRewardModal(record.type, record);
    }
}

function deleteRewardRecord(id) {
    showConfirm('确定要删除该记录吗？', () => {
        const index = AppState.rewardRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.rewardRecords.splice(index, 1);
            loadRewardRecords();
            showToast('删除成功！', 'success');
        }
    });
}

// ========================================
// 成长档案管理
// ========================================
function searchGrowthRecord() {
    const keyword = document.getElementById('growth-search').value.trim();
    if (!keyword) {
        showToast('请输入学生姓名', 'warning');
        return;
    }
    
    const student = AppState.students.find(s => s.name.includes(keyword));
    if (student) {
        loadGrowthProfile(student);
    } else {
        showToast('未找到该学生', 'warning');
        document.getElementById('growth-profile').style.display = 'none';
    }
}

function loadGrowthProfile(student) {
    document.getElementById('growth-profile').style.display = 'block';
    document.getElementById('growth-avatar').textContent = student.name.charAt(0);
    document.getElementById('growth-name').textContent = student.name;
    document.getElementById('growth-class').textContent = student.className;
    
    const records = AppState.growthRecords.filter(r => r.studentId == student.id);
    const timeline = document.getElementById('growth-timeline');
    
    timeline.innerHTML = records.map(record => `
        <div class="timeline-item">
            <div class="timeline-date">${record.date}</div>
            <div class="timeline-content">
                <h5>${record.title}</h5>
                <p>${record.content}</p>
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-muted); text-align: center;">暂无成长记录</p>';
}

function showGrowthModal() {
    const studentName = document.getElementById('growth-name').textContent;
    const student = AppState.students.find(s => s.name === studentName);
    
    if (!student) {
        showToast('请先选择学生', 'warning');
        return;
    }
    
    openModal('添加成长记录', `
        <form id="growth-form" class="modal-form">
            <input type="hidden" name="studentId" value="${student.id}">
            <input type="hidden" name="studentName" value="${student.name}">
            <div class="form-group">
                <label>日期</label>
                <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>标题</label>
                <input type="text" name="title" placeholder="如：获得校级奖励" required>
            </div>
            <div class="form-group">
                <label>内容</label>
                <textarea name="content" rows="4" placeholder="详细描述成长记录..." required></textarea>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveGrowthRecord()">保存</button>
    `);
}

function saveGrowthRecord() {
    const form = document.getElementById('growth-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    data.id = generateId();
    AppState.growthRecords.unshift(data);
    
    closeModal();
    
    const student = AppState.students.find(s => s.id == data.studentId);
    if (student) {
        loadGrowthProfile(student);
    }
    
    showToast('成长记录添加成功！', 'success');
}

// ========================================
// 成绩管理
// ========================================
function downloadGradeTemplate() {
    showToast('成绩模板下载中...', 'info');
    setTimeout(() => {
        showToast('模板下载成功！', 'success');
    }, 1000);
}

function loadGradeAnalysis() {
    // 销毁已存在的图表
    if (AppState.chartInstances.subjectAvgChart) {
        AppState.chartInstances.subjectAvgChart.destroy();
    }
    if (AppState.chartInstances.scoreDistChart) {
        AppState.chartInstances.scoreDistChart.destroy();
    }
    
    const examId = document.getElementById('analysis-exam')?.value || 1;
    const grades = AppState.grades.filter(g => g.examId == examId);
    
    if (grades.length === 0) {
        showToast('暂无该考试的成绩数据', 'info');
        return;
    }
    
    // 计算统计数据
    const totalScores = grades.map(g => g.total);
    const maxScore = Math.max(...totalScores);
    const minScore = Math.min(...totalScores);
    const avgScore = (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1);
    
    // 计算及格率和优秀率（假设总分满分500，及格300，优秀400）
    const passRate = ((grades.filter(g => g.total >= 300).length / grades.length) * 100).toFixed(0);
    const excellentRate = ((grades.filter(g => g.total >= 400).length / grades.length) * 100).toFixed(0);
    
    document.getElementById('max-score').textContent = maxScore;
    document.getElementById('min-score').textContent = minScore;
    document.getElementById('avg-score-analysis').textContent = avgScore;
    document.getElementById('pass-rate').textContent = passRate + '%';
    document.getElementById('excellent-rate').textContent = excellentRate + '%';
    
    // 各科平均分图表
    const subjects = ['chinese', 'math', 'english', 'physics', 'chemistry'];
    const subjectNames = ['语文', '数学', '英语', '物理', '化学'];
    const subjectAvgs = subjects.map(sub => 
        (grades.reduce((sum, g) => sum + g[sub], 0) / grades.length).toFixed(1)
    );
    
    const subjectCtx = document.getElementById('subjectAvgChart');
    if (subjectCtx) {
        AppState.chartInstances.subjectAvgChart = new Chart(subjectCtx, {
            type: 'bar',
            data: {
                labels: subjectNames,
                datasets: [{
                    label: '平均分',
                    data: subjectAvgs,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(72, 187, 120, 0.8)',
                        'rgba(237, 137, 54, 0.8)',
                        'rgba(159, 122, 234, 0.8)',
                        'rgba(66, 153, 225, 0.8)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // 分数段分布
    const scoreDist = [0, 0, 0, 0, 0]; // <60, 60-69, 70-79, 80-89, 90+
    grades.forEach(g => {
        const avg = g.total / 5;
        if (avg < 60) scoreDist[0]++;
        else if (avg < 70) scoreDist[1]++;
        else if (avg < 80) scoreDist[2]++;
        else if (avg < 90) scoreDist[3]++;
        else scoreDist[4]++;
    });
    
    const distCtx = document.getElementById('scoreDistChart');
    if (distCtx) {
        AppState.chartInstances.scoreDistChart = new Chart(distCtx, {
            type: 'pie',
            data: {
                labels: ['不及格(<60)', '及格(60-69)', '中等(70-79)', '良好(80-89)', '优秀(90+)'],
                datasets: [{
                    data: scoreDist,
                    backgroundColor: [
                        '#f56565',
                        '#ed8936',
                        '#ecc94b',
                        '#48bb78',
                        '#4299e1'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function loadStudentTrend() {
    const keyword = document.getElementById('trend-student').value.trim();
    if (!keyword) {
        showToast('请输入学生姓名', 'warning');
        return;
    }
    
    const student = AppState.students.find(s => s.name.includes(keyword));
    if (!student) {
        showToast('未找到该学生', 'warning');
        document.getElementById('trend-content').style.display = 'none';
        return;
    }
    
    document.getElementById('trend-content').style.display = 'block';
    document.getElementById('trend-student-name').textContent = student.name;
    document.getElementById('trend-student-class').textContent = student.className;
    
    // 获取该学生的所有成绩
    const studentGrades = AppState.grades.filter(g => g.studentId == student.id);
    
    // 填充成绩历史表格
    const tbody = document.getElementById('grade-history-list');
    tbody.innerHTML = studentGrades.map(g => {
        const exam = MockData.exams.find(e => e.id == g.examId);
        return `
            <tr>
                <td>${exam?.name || '-'}</td>
                <td>${g.chinese}</td>
                <td>${g.math}</td>
                <td>${g.english}</td>
                <td>${g.physics}</td>
                <td>${g.chemistry}</td>
                <td><strong>${g.total}</strong></td>
                <td>${g.rank}</td>
            </tr>
        `;
    }).join('');
    
    // 绘制趋势图
    drawTrendCharts(studentGrades);
}

function drawTrendCharts(grades) {
    // 销毁已存在的图表
    if (AppState.chartInstances.totalScoreTrend) {
        AppState.chartInstances.totalScoreTrend.destroy();
    }
    if (AppState.chartInstances.subjectScoreTrend) {
        AppState.chartInstances.subjectScoreTrend.destroy();
    }
    
    const labels = grades.map(g => {
        const exam = MockData.exams.find(e => e.id == g.examId);
        return exam?.name?.replace('2024年', '') || `考试${g.examId}`;
    });
    
    // 总成绩趋势
    const totalCtx = document.getElementById('totalScoreTrend');
    if (totalCtx) {
        AppState.chartInstances.totalScoreTrend = new Chart(totalCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '总成绩',
                    data: grades.map(g => g.total),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 350,
                        max: 500
                    }
                }
            }
        });
    }
    
    // 各科成绩趋势
    const subjectCtx = document.getElementById('subjectScoreTrend');
    if (subjectCtx) {
        AppState.chartInstances.subjectScoreTrend = new Chart(subjectCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '语文',
                        data: grades.map(g => g.chinese),
                        borderColor: '#f56565',
                        tension: 0.4,
                        pointRadius: 4
                    },
                    {
                        label: '数学',
                        data: grades.map(g => g.math),
                        borderColor: '#48bb78',
                        tension: 0.4,
                        pointRadius: 4
                    },
                    {
                        label: '英语',
                        data: grades.map(g => g.english),
                        borderColor: '#4299e1',
                        tension: 0.4,
                        pointRadius: 4
                    },
                    {
                        label: '物理',
                        data: grades.map(g => g.physics),
                        borderColor: '#ed8936',
                        tension: 0.4,
                        pointRadius: 4
                    },
                    {
                        label: '化学',
                        data: grades.map(g => g.chemistry),
                        borderColor: '#9f7aea',
                        tension: 0.4,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    }
}

function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const examId = document.getElementById('report-exam').value;
    
    const grades = AppState.grades.filter(g => g.examId == examId);
    
    let thead = '';
    let tbody = '';
    
    switch (reportType) {
        case 'class':
            thead = '<tr><th>班级</th><th>人数</th><th>平均分</th><th>最高分</th><th>最低分</th><th>及格率</th><th>优秀率</th></tr>';
            
            const classData = {};
            grades.forEach(g => {
                const student = AppState.students.find(s => s.id == g.studentId);
                if (student) {
                    const className = student.className;
                    if (!classData[className]) {
                        classData[className] = [];
                    }
                    classData[className].push(g);
                }
            });
            
            tbody = Object.entries(classData).map(([className, classGrades]) => {
                const totals = classGrades.map(g => g.total);
                const avg = (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1);
                const max = Math.max(...totals);
                const min = Math.min(...totals);
                const passRate = ((classGrades.filter(g => g.total >= 300).length / classGrades.length) * 100).toFixed(0);
                const excellentRate = ((classGrades.filter(g => g.total >= 400).length / classGrades.length) * 100).toFixed(0);
                
                return `<tr>
                    <td>${className}</td>
                    <td>${classGrades.length}</td>
                    <td>${avg}</td>
                    <td>${max}</td>
                    <td>${min}</td>
                    <td>${passRate}%</td>
                    <td>${excellentRate}%</td>
                </tr>`;
            }).join('');
            break;
            
        case 'subject':
            thead = '<tr><th>学科</th><th>平均分</th><th>最高分</th><th>最低分</th><th>及格率</th><th>优秀率</th></tr>';
            
            const subjects = [
                { key: 'chinese', name: '语文' },
                { key: 'math', name: '数学' },
                { key: 'english', name: '英语' },
                { key: 'physics', name: '物理' },
                { key: 'chemistry', name: '化学' }
            ];
            
            tbody = subjects.map(sub => {
                const scores = grades.map(g => g[sub.key]);
                const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
                const max = Math.max(...scores);
                const min = Math.min(...scores);
                const passRate = ((scores.filter(s => s >= 60).length / scores.length) * 100).toFixed(0);
                const excellentRate = ((scores.filter(s => s >= 90).length / scores.length) * 100).toFixed(0);
                
                return `<tr>
                    <td>${sub.name}</td>
                    <td>${avg}</td>
                    <td>${max}</td>
                    <td>${min}</td>
                    <td>${passRate}%</td>
                    <td>${excellentRate}%</td>
                </tr>`;
            }).join('');
            break;
            
        case 'student':
            thead = '<tr><th>排名</th><th>姓名</th><th>班级</th><th>语文</th><th>数学</th><th>英语</th><th>物理</th><th>化学</th><th>总分</th></tr>';
            
            const sortedGrades = [...grades].sort((a, b) => b.total - a.total);
            tbody = sortedGrades.map((g, index) => {
                const student = AppState.students.find(s => s.id == g.studentId);
                return `<tr>
                    <td>${index + 1}</td>
                    <td>${student?.name || '-'}</td>
                    <td>${student?.className || '-'}</td>
                    <td>${g.chinese}</td>
                    <td>${g.math}</td>
                    <td>${g.english}</td>
                    <td>${g.physics}</td>
                    <td>${g.chemistry}</td>
                    <td><strong>${g.total}</strong></td>
                </tr>`;
            }).join('');
            break;
            
        case 'compare':
            thead = '<tr><th>班级</th><th>语文均分</th><th>数学均分</th><th>英语均分</th><th>物理均分</th><th>化学均分</th><th>总均分</th></tr>';
            
            const compareData = {};
            grades.forEach(g => {
                const student = AppState.students.find(s => s.id == g.studentId);
                if (student) {
                    const className = student.className;
                    if (!compareData[className]) {
                        compareData[className] = { grades: [], subjects: {} };
                    }
                    compareData[className].grades.push(g);
                }
            });
            
            tbody = Object.entries(compareData).map(([className, data]) => {
                const count = data.grades.length;
                const chineseAvg = (data.grades.reduce((sum, g) => sum + g.chinese, 0) / count).toFixed(1);
                const mathAvg = (data.grades.reduce((sum, g) => sum + g.math, 0) / count).toFixed(1);
                const englishAvg = (data.grades.reduce((sum, g) => sum + g.english, 0) / count).toFixed(1);
                const physicsAvg = (data.grades.reduce((sum, g) => sum + g.physics, 0) / count).toFixed(1);
                const chemistryAvg = (data.grades.reduce((sum, g) => sum + g.chemistry, 0) / count).toFixed(1);
                const totalAvg = (data.grades.reduce((sum, g) => sum + g.total, 0) / count).toFixed(1);
                
                return `<tr>
                    <td>${className}</td>
                    <td>${chineseAvg}</td>
                    <td>${mathAvg}</td>
                    <td>${englishAvg}</td>
                    <td>${physicsAvg}</td>
                    <td>${chemistryAvg}</td>
                    <td><strong>${totalAvg}</strong></td>
                </tr>`;
            }).join('');
            break;
    }
    
    document.getElementById('report-thead').innerHTML = thead;
    document.getElementById('report-tbody').innerHTML = tbody;
}

function exportReport() {
    showToast('报表导出中...', 'info');
    setTimeout(() => {
        showToast('报表导出成功！', 'success');
    }, 1500);
}

// ========================================
// 用户管理
// ========================================
function loadUserList() {
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
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveUser()">保存</button>
    `);
}

function saveUser() {
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

function editUser(id) {
    const user = AppState.users.find(u => u.id == id);
    if (user) {
        showUserModal(user);
    }
}

function deleteUser(id) {
    if (id == AppState.currentUser?.id) {
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

// ========================================
// 权限管理
// ========================================
function loadPermissions(role) {
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

// ========================================
// 模态框
// ========================================
function openModal(title, bodyContent, footerContent = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyContent;
    document.getElementById('modal-footer').innerHTML = footerContent;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// ========================================
// 文件上传处理
// ========================================
function setupFileUpload() {
    // 学生信息导入
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
    
    // 成绩导入
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

function handleFileUpload(file) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('请上传Excel文件', 'error');
        return;
    }
    
    showToast('文件上传成功，正在解析...', 'info');
    
    // 模拟解析
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

function handleGradeUpload(file) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('请上传Excel文件', 'error');
        return;
    }
    
    showToast('成绩文件上传成功，正在导入...', 'info');
    
    setTimeout(() => {
        showToast('成绩导入成功！', 'success');
    }, 1500);
}

function cancelImport() {
    document.getElementById('import-preview').style.display = 'none';
    document.getElementById('import-file').value = '';
}

function confirmImport() {
    showToast('正在导入数据...', 'info');
    
    setTimeout(() => {
        // 模拟添加学生
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

// ========================================
// 事件绑定
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 登录表单
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;
        login(username, password, role);
    });
    
    // 注册表单
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
        
        register(username, email, password, role);
    });
    
    // 忘记密码表单
    document.getElementById('forgot-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        forgotPassword(email);
    });
    
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
    
    // 学生信息录入表单
    document.getElementById('student-add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        if (addStudent(data)) {
            this.reset();
        }
    });
    
    // 学生信息修改表单
    document.getElementById('student-edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;
        updateStudent(id, data);
    });
    
    // 奖惩记录标签页
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadRewardRecords(this.dataset.tab);
        });
    });
    
    // 角色切换
    document.querySelectorAll('.role-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.role-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            loadPermissions(this.dataset.role);
        });
    });
    
    // 模态框关闭
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // 文件上传
    setupFileUpload();
    
    // ESC关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// 添加一些CSS样式到模态框内的表单
const style = document.createElement('style');
style.textContent = `
    .modal-form .form-group {
        margin-bottom: 16px;
    }
    .modal-form .form-row {
        display: flex;
        gap: 16px;
    }
    .modal-form .form-row .form-group {
        flex: 1;
    }
    .student-detail .detail-section {
        margin-bottom: 24px;
    }
    .student-detail .detail-section h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
    }
    .student-detail .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    .student-detail .detail-item {
        display: flex;
        gap: 8px;
    }
    .student-detail .detail-item label {
        color: var(--text-secondary);
        font-size: 13px;
        min-width: 70px;
    }
    .student-detail .detail-item span {
        font-weight: 500;
    }
`;
document.head.appendChild(style);
