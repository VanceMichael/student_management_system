/**
 * 学生信息管理系统 - 主入口文件
 * 使用 ES Module 方式组织代码
 */

import { initStore, studentStore, getState, setState, chartStore } from './modules/store.js';
import { initAuthEvents, logout, switchModule, showForm, login, register, forgotPassword, setModuleInitMap } from './modules/auth.js';
import { initStudentEvents, loadStudentList } from './modules/student.js';
import { initBehaviorEvents, loadHealthRecords, loadRewardRecords } from './modules/behavior.js';
import { initGradeEvents, loadGradeAnalysis } from './modules/grade.js';
import { initAdminEvents, loadUserList, loadPermissions } from './modules/admin.js';
import { showToast } from './components/toast.js';
import { closeModal } from './components/modal.js';

// 模块数据初始化映射
const moduleInitMap = {
    'dashboard': initDashboard,
    'student-query': () => loadStudentList(),
    'health-record': () => loadHealthRecords(),
    'reward-record': () => loadRewardRecords(),
    'grade-analysis': () => loadGradeAnalysis(),
    'grade-report': () => window.generateReport?.(),
    'user-manage': () => loadUserList(),
    'permission': () => loadPermissions('admin')
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据存储
    initStore();
    
    // 设置模块初始化映射
    setModuleInitMap(moduleInitMap);
    
    // 初始化各模块事件
    initAuthEvents();
    initStudentEvents();
    initBehaviorEvents();
    initGradeEvents();
    initAdminEvents();
    
    // 模态框关闭事件
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // ESC关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // 暴露全局函数（供HTML内联事件使用）
    window.logout = logout;
    window.closeModal = closeModal;
    window.showForm = showForm;
    window.login = login;
    window.register = register;
    window.forgotPassword = forgotPassword;
    
    console.log('学生信息管理系统已初始化');
});

// 初始化仪表板
function initDashboard() {
    const students = studentStore.getAll();
    const rewardRecords = getState('rewardRecords') || [];
    const grades = getState('grades') || [];
    
    // 更新统计数据
    const totalStudentsEl = document.getElementById('total-students');
    const totalClassesEl = document.getElementById('total-classes');
    const totalAwardsEl = document.getElementById('total-awards');
    const avgScoreEl = document.getElementById('avg-score');
    
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (totalClassesEl) totalClassesEl.textContent = [...new Set(students.map(s => s.className))].length;
    if (totalAwardsEl) totalAwardsEl.textContent = rewardRecords.filter(r => r.type === 'reward').length;
    
    // 计算平均成绩
    const latestGrades = grades.filter(g => g.examId === 1);
    const avgScore = latestGrades.length > 0 
        ? (latestGrades.reduce((sum, g) => sum + g.total, 0) / latestGrades.length / 5).toFixed(1)
        : 0;
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    
    // 加载最近添加的学生
    loadRecentStudents();
    
    // 初始化图表
    initDashboardCharts();
}

// 加载最近添加的学生
function loadRecentStudents() {
    const tbody = document.getElementById('recent-students');
    if (!tbody) return;
    
    const recentStudents = studentStore.getAll().slice(-5).reverse();
    
    tbody.innerHTML = recentStudents.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.className}</td>
            <td>${student.addTime}</td>
        </tr>
    `).join('');
}

// 初始化仪表板图表
function initDashboardCharts() {
    // 销毁已存在的图表
    chartStore.destroy('gradeDistChart');
    chartStore.destroy('classChart');
    
    // 成绩分布图
    const gradeDistCtx = document.getElementById('gradeDistChart');
    if (gradeDistCtx && typeof Chart !== 'undefined') {
        chartStore.set('gradeDistChart', new Chart(gradeDistCtx, {
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
        }));
    }
    
    // 班级人数图
    const classCtx = document.getElementById('classChart');
    if (classCtx && typeof Chart !== 'undefined') {
        const students = studentStore.getAll();
        const classData = {};
        students.forEach(s => {
            classData[s.className] = (classData[s.className] || 0) + 1;
        });
        
        chartStore.set('classChart', new Chart(classCtx, {
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
        }));
    }
}

// 导出模块（供其他模块使用）
export {
    initDashboard,
    loadRecentStudents,
    initDashboardCharts
};
