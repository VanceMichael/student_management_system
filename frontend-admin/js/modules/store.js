/**
 * 数据状态管理模块 - Store
 * 集中管理应用的所有数据状态
 */

// 模拟数据
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

// 应用状态
const AppState = {
    currentUser: null,
    currentModule: 'dashboard',
    students: [],
    grades: [],
    healthRecords: [],
    rewardRecords: [],
    growthRecords: [],
    users: [],
    exams: [],
    chartInstances: {}
};

// 初始化数据
function initStore() {
    AppState.students = [...MockData.students];
    AppState.users = [...MockData.users];
    AppState.healthRecords = [...MockData.healthRecords];
    AppState.rewardRecords = [...MockData.rewardRecords];
    AppState.growthRecords = [...MockData.growthRecords];
    AppState.grades = [...MockData.grades];
    AppState.exams = [...MockData.exams];
}

// 获取状态
function getState(key) {
    return key ? AppState[key] : { ...AppState };
}

// 设置状态
function setState(key, value) {
    AppState[key] = value;
}

// 获取当前用户
function getCurrentUser() {
    return AppState.currentUser;
}

// 设置当前用户
function setCurrentUser(user) {
    AppState.currentUser = user;
}

// 获取权限配置
function getPermissions(role) {
    return MockData.permissions[role] || {};
}

// 学生数据操作
const studentStore = {
    getAll: () => [...AppState.students],
    getById: (id) => AppState.students.find(s => s.id == id),
    add: (student) => {
        AppState.students.push(student);
        return student;
    },
    update: (id, data) => {
        const index = AppState.students.findIndex(s => s.id == id);
        if (index !== -1) {
            AppState.students[index] = { ...AppState.students[index], ...data };
            return AppState.students[index];
        }
        return null;
    },
    delete: (id) => {
        const index = AppState.students.findIndex(s => s.id == id);
        if (index !== -1) {
            AppState.students.splice(index, 1);
            return true;
        }
        return false;
    },
    query: (filters = {}) => {
        let result = [...AppState.students];
        if (filters.name) {
            result = result.filter(s => s.name.includes(filters.name));
        }
        if (filters.gender) {
            result = result.filter(s => s.gender === filters.gender);
        }
        if (filters.ethnicity) {
            result = result.filter(s => s.ethnicity === filters.ethnicity);
        }
        if (filters.leftBehind) {
            result = result.filter(s => s.leftBehindChild === filters.leftBehind);
        }
        return result;
    }
};

// 用户数据操作
const userStore = {
    getAll: () => [...AppState.users],
    getById: (id) => AppState.users.find(u => u.id == id),
    getByUsername: (username) => AppState.users.find(u => u.username === username),
    add: (user) => {
        AppState.users.push(user);
        return user;
    },
    update: (id, data) => {
        const index = AppState.users.findIndex(u => u.id == id);
        if (index !== -1) {
            AppState.users[index] = { ...AppState.users[index], ...data };
            return AppState.users[index];
        }
        return null;
    },
    delete: (id) => {
        const index = AppState.users.findIndex(u => u.id == id);
        if (index !== -1) {
            AppState.users.splice(index, 1);
            return true;
        }
        return false;
    }
};

// 健康记录数据操作
const healthStore = {
    getAll: () => [...AppState.healthRecords],
    getById: (id) => AppState.healthRecords.find(r => r.id == id),
    getByStudentId: (studentId) => AppState.healthRecords.filter(r => r.studentId == studentId),
    add: (record) => {
        AppState.healthRecords.push(record);
        return record;
    },
    update: (id, data) => {
        const index = AppState.healthRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.healthRecords[index] = { ...AppState.healthRecords[index], ...data };
            return AppState.healthRecords[index];
        }
        return null;
    },
    delete: (id) => {
        const index = AppState.healthRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.healthRecords.splice(index, 1);
            return true;
        }
        return false;
    }
};

// 奖惩记录数据操作
const rewardStore = {
    getAll: () => [...AppState.rewardRecords],
    getById: (id) => AppState.rewardRecords.find(r => r.id == id),
    getByStudentId: (studentId) => AppState.rewardRecords.filter(r => r.studentId == studentId),
    getByType: (type) => AppState.rewardRecords.filter(r => r.type === type),
    add: (record) => {
        AppState.rewardRecords.push(record);
        return record;
    },
    update: (id, data) => {
        const index = AppState.rewardRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.rewardRecords[index] = { ...AppState.rewardRecords[index], ...data };
            return AppState.rewardRecords[index];
        }
        return null;
    },
    delete: (id) => {
        const index = AppState.rewardRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.rewardRecords.splice(index, 1);
            return true;
        }
        return false;
    }
};

// 成长记录数据操作
const growthStore = {
    getAll: () => [...AppState.growthRecords],
    getById: (id) => AppState.growthRecords.find(r => r.id == id),
    getByStudentId: (studentId) => AppState.growthRecords.filter(r => r.studentId == studentId),
    add: (record) => {
        AppState.growthRecords.unshift(record);
        return record;
    },
    update: (id, data) => {
        const index = AppState.growthRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.growthRecords[index] = { ...AppState.growthRecords[index], ...data };
            return AppState.growthRecords[index];
        }
        return null;
    },
    delete: (id) => {
        const index = AppState.growthRecords.findIndex(r => r.id == id);
        if (index !== -1) {
            AppState.growthRecords.splice(index, 1);
            return true;
        }
        return false;
    }
};

// 成绩数据操作
const gradeStore = {
    getAll: () => [...AppState.grades],
    getByExamId: (examId) => AppState.grades.filter(g => g.examId == examId),
    getByStudentId: (studentId) => AppState.grades.filter(g => g.studentId == studentId),
    getByStudentAndExam: (studentId, examId) => AppState.grades.find(g => g.studentId == studentId && g.examId == examId),
    add: (grade) => {
        AppState.grades.push(grade);
        return grade;
    },
    update: (studentId, examId, data) => {
        const index = AppState.grades.findIndex(g => g.studentId == studentId && g.examId == examId);
        if (index !== -1) {
            AppState.grades[index] = { ...AppState.grades[index], ...data };
            return AppState.grades[index];
        }
        return null;
    },
    delete: (studentId, examId) => {
        const index = AppState.grades.findIndex(g => g.studentId == studentId && g.examId == examId);
        if (index !== -1) {
            AppState.grades.splice(index, 1);
            return true;
        }
        return false;
    }
};

// 考试数据操作
const examStore = {
    getAll: () => [...AppState.exams],
    getById: (id) => AppState.exams.find(e => e.id == id),
    add: (exam) => {
        AppState.exams.push(exam);
        return exam;
    }
};

// 图表实例管理
const chartStore = {
    get: (name) => AppState.chartInstances[name],
    set: (name, instance) => {
        AppState.chartInstances[name] = instance;
    },
    destroy: (name) => {
        if (AppState.chartInstances[name]) {
            AppState.chartInstances[name].destroy();
            delete AppState.chartInstances[name];
        }
    },
    destroyAll: () => {
        Object.values(AppState.chartInstances).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        AppState.chartInstances = {};
    }
};

export {
    initStore,
    getState,
    setState,
    getCurrentUser,
    setCurrentUser,
    getPermissions,
    studentStore,
    userStore,
    healthStore,
    rewardStore,
    growthStore,
    gradeStore,
    examStore,
    chartStore,
    MockData
};
