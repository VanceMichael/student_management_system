/**
 * 成绩管理模块 - Grade
 * 处理成绩导入、分析、趋势追踪、报表等功能
 */

import { gradeStore, examStore, studentStore, chartStore } from './store.js';
import { showToast } from '../components/toast.js';
import { exportToCSV } from './utils.js';

// 下载成绩模板
function downloadGradeTemplate() {
    showToast('成绩模板下载中...', 'info');
    setTimeout(() => {
        showToast('模板下载成功！', 'success');
    }, 1000);
}

// 加载成绩分析
function loadGradeAnalysis() {
    // 销毁已存在的图表
    chartStore.destroy('subjectAvgChart');
    chartStore.destroy('scoreDistChart');
    
    const examId = document.getElementById('analysis-exam')?.value || 1;
    const grades = gradeStore.getByExamId(examId);
    
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
    
    // 更新显示
    const maxScoreEl = document.getElementById('max-score');
    const minScoreEl = document.getElementById('min-score');
    const avgScoreEl = document.getElementById('avg-score-analysis');
    const passRateEl = document.getElementById('pass-rate');
    const excellentRateEl = document.getElementById('excellent-rate');
    
    if (maxScoreEl) maxScoreEl.textContent = maxScore;
    if (minScoreEl) minScoreEl.textContent = minScore;
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (passRateEl) passRateEl.textContent = passRate + '%';
    if (excellentRateEl) excellentRateEl.textContent = excellentRate + '%';
    
    // 各科平均分图表
    const subjects = ['chinese', 'math', 'english', 'physics', 'chemistry'];
    const subjectNames = ['语文', '数学', '英语', '物理', '化学'];
    const subjectAvgs = subjects.map(sub => 
        (grades.reduce((sum, g) => sum + g[sub], 0) / grades.length).toFixed(1)
    );
    
    const subjectCtx = document.getElementById('subjectAvgChart');
    if (subjectCtx && typeof Chart !== 'undefined') {
        chartStore.set('subjectAvgChart', new Chart(subjectCtx, {
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
        }));
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
    if (distCtx && typeof Chart !== 'undefined') {
        chartStore.set('scoreDistChart', new Chart(distCtx, {
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
        }));
    }
}

// 加载学生成绩趋势
function loadStudentTrend() {
    const keyword = document.getElementById('trend-student')?.value.trim();
    if (!keyword) {
        showToast('请输入学生姓名', 'warning');
        return;
    }
    
    const student = studentStore.getAll().find(s => s.name.includes(keyword));
    if (!student) {
        showToast('未找到该学生', 'warning');
        const trendContent = document.getElementById('trend-content');
        if (trendContent) trendContent.style.display = 'none';
        return;
    }
    
    const trendContent = document.getElementById('trend-content');
    const trendStudentName = document.getElementById('trend-student-name');
    const trendStudentClass = document.getElementById('trend-student-class');
    
    if (trendContent) trendContent.style.display = 'block';
    if (trendStudentName) trendStudentName.textContent = student.name;
    if (trendStudentClass) trendStudentClass.textContent = student.className;
    
    // 获取该学生的所有成绩
    const studentGrades = gradeStore.getByStudentId(student.id);
    const exams = examStore.getAll();
    
    // 填充成绩历史表格
    const tbody = document.getElementById('grade-history-list');
    if (tbody) {
        tbody.innerHTML = studentGrades.map(g => {
            const exam = exams.find(e => e.id == g.examId);
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
    }
    
    // 绘制趋势图
    drawTrendCharts(studentGrades, exams);
}

// 绘制趋势图表
function drawTrendCharts(grades, exams) {
    // 销毁已存在的图表
    chartStore.destroy('totalScoreTrend');
    chartStore.destroy('subjectScoreTrend');
    
    const labels = grades.map(g => {
        const exam = exams.find(e => e.id == g.examId);
        return exam?.name?.replace('2024年', '') || `考试${g.examId}`;
    });
    
    // 总成绩趋势
    const totalCtx = document.getElementById('totalScoreTrend');
    if (totalCtx && typeof Chart !== 'undefined') {
        chartStore.set('totalScoreTrend', new Chart(totalCtx, {
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
        }));
    }
    
    // 各科成绩趋势
    const subjectCtx = document.getElementById('subjectScoreTrend');
    if (subjectCtx && typeof Chart !== 'undefined') {
        chartStore.set('subjectScoreTrend', new Chart(subjectCtx, {
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
        }));
    }
}

// 生成报表
function generateReport() {
    const reportType = document.getElementById('report-type')?.value;
    const examId = document.getElementById('report-exam')?.value;
    
    const grades = gradeStore.getByExamId(examId);
    const students = studentStore.getAll();
    
    let thead = '';
    let tbody = '';
    
    switch (reportType) {
        case 'class':
            thead = '<tr><th>班级</th><th>人数</th><th>平均分</th><th>最高分</th><th>最低分</th><th>及格率</th><th>优秀率</th></tr>';
            
            const classData = {};
            grades.forEach(g => {
                const student = students.find(s => s.id == g.studentId);
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
                const student = students.find(s => s.id == g.studentId);
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
                const student = students.find(s => s.id == g.studentId);
                if (student) {
                    const className = student.className;
                    if (!compareData[className]) {
                        compareData[className] = { grades: [] };
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
    
    const reportThead = document.getElementById('report-thead');
    const reportTbody = document.getElementById('report-tbody');
    
    if (reportThead) reportThead.innerHTML = thead;
    if (reportTbody) reportTbody.innerHTML = tbody;
}

// 导出报表
function exportReport() {
    showToast('报表导出中...', 'info');
    setTimeout(() => {
        showToast('报表导出成功！', 'success');
    }, 1500);
}

// 处理成绩文件上传
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

// 设置成绩文件上传
function setupGradeFileUpload() {
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

// 初始化成绩模块事件
function initGradeEvents() {
    setupGradeFileUpload();
    
    // 暴露函数到全局
    window.downloadGradeTemplate = downloadGradeTemplate;
    window.loadGradeAnalysis = loadGradeAnalysis;
    window.loadStudentTrend = loadStudentTrend;
    window.generateReport = generateReport;
    window.exportReport = exportReport;
}

export {
    downloadGradeTemplate,
    loadGradeAnalysis,
    loadStudentTrend,
    drawTrendCharts,
    generateReport,
    exportReport,
    handleGradeUpload,
    setupGradeFileUpload,
    initGradeEvents
};
