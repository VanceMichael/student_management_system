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

const AppState = {
    currentUser: null,
    currentModule: 'dashboard',
    students: [...MockData.students],
    grades: [...MockData.grades],
    healthRecords: [...MockData.healthRecords],
    rewardRecords: [...MockData.rewardRecords],
    growthRecords: [...MockData.growthRecords],
    users: [...MockData.users],
    chartInstances: {}
};

const Store = {
    getState: () => AppState,
    
    getMockData: () => MockData,
    
    setCurrentUser: (user) => {
        AppState.currentUser = user;
    },
    
    getCurrentUser: () => AppState.currentUser,
    
    setCurrentModule: (module) => {
        AppState.currentModule = module;
    },
    
    addStudent: (student) => {
        AppState.students.push(student);
    },
    
    updateStudent: (id, studentData) => {
        const index = AppState.students.findIndex(s => s.id === id);
        if (index !== -1) {
            AppState.students[index] = { ...AppState.students[index], ...studentData };
        }
    },
    
    deleteStudent: (id) => {
        AppState.students = AppState.students.filter(s => s.id !== id);
    },
    
    addUser: (user) => {
        AppState.users.push(user);
    },
    
    updateUser: (id, userData) => {
        const index = AppState.users.findIndex(u => u.id === id);
        if (index !== -1) {
            AppState.users[index] = { ...AppState.users[index], ...userData };
        }
    },
    
    deleteUser: (id) => {
        AppState.users = AppState.users.filter(u => u.id !== id);
    },
    
    addHealthRecord: (record) => {
        AppState.healthRecords.push(record);
    },
    
    addRewardRecord: (record) => {
        AppState.rewardRecords.push(record);
    },
    
    addGrowthRecord: (record) => {
        AppState.growthRecords.push(record);
    },
    
    addGrade: (grade) => {
        AppState.grades.push(grade);
    },
    
    setChartInstance: (key, chart) => {
        AppState.chartInstances[key] = chart;
    },
    
    getChartInstance: (key) => AppState.chartInstances[key],
    
    hasPermission: (moduleName) => {
        if (!AppState.currentUser) return false;
        const role = AppState.currentUser.role;
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
        const permKey = modulePermissionMap[moduleName];
        return MockData.permissions[role] && MockData.permissions[role][permKey];
    }
};

window.Store = Store;

const getState = Store.getState;
const getCurrentUser = Store.getCurrentUser;

export { AppState, MockData, Store, getState, getCurrentUser };
