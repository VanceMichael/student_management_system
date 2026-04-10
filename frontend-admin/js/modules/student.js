/**
 * 学生信息管理模块 - Student
 * 处理学生的增删改查、导入导出等功能
 */

import { studentStore, getState } from './store.js';
import { generateId, formatDate } from './utils.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { showConfirm } from '../components/confirm.js';
import { renderTable } from '../components/table.js';

// 下载导入模板
function downloadTemplate() {
    showToast('模板下载中...', 'info');
    setTimeout(() => {
        showToast('模板下载成功！', 'success');
    }, 1000);
}

// 添加学生
function addStudent(formData) {
    const student = {
        id: generateId(),
        ...formData,
        className: '三年级一班',
        addTime: new Date().toISOString().split('T')[0]
    };
    
    studentStore.add(student);
    showToast('学生信息添加成功！', 'success');
    return student;
}

// 更新学生
function updateStudent(id, formData) {
    const student = studentStore.update(id, formData);
    if (student) {
        showToast('学生信息更新成功！', 'success');
        return true;
    }
    return false;
}

// 删除学生
function deleteStudent(id, onSuccess) {
    showConfirm('确定要删除该学生信息吗？此操作不可恢复。', () => {
        if (studentStore.delete(id)) {
            showToast('学生信息已删除', 'success');
            if (onSuccess) onSuccess();
        }
    });
}

// 搜索学生（用于编辑）
function searchStudentForEdit() {
    const keyword = document.getElementById('edit-search').value.trim();
    if (!keyword) {
        showToast('请输入搜索关键词', 'warning');
        return null;
    }
    
    const student = studentStore.getAll().find(s => 
        s.name.includes(keyword) || s.idCard.includes(keyword)
    );
    
    if (student) {
        fillEditForm(student);
        const editResult = document.getElementById('edit-result');
        if (editResult) {
            editResult.style.display = 'block';
        }
        return student;
    } else {
        showToast('未找到匹配的学生', 'warning');
        const editResult = document.getElementById('edit-result');
        if (editResult) {
            editResult.style.display = 'none';
        }
        return null;
    }
}

// 填充编辑表单
function fillEditForm(student) {
    const form = document.getElementById('student-edit-form');
    if (!form) return;
    
    Object.keys(student).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = student[key];
        }
    });
}

// 加载学生列表
function loadStudentList(filters = {}) {
    const students = studentStore.query(filters);
    const tbody = document.getElementById('student-list');
    
    if (!tbody) return;
    
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
                    <button class="btn-view" onclick="window.viewStudent(${student.id})">查看</button>
                    <button class="btn-edit" onclick="window.editStudent(${student.id})">编辑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 查询学生
function queryStudents() {
    const filters = {
        name: document.getElementById('query-name')?.value || '',
        gender: document.getElementById('query-gender')?.value || '',
        ethnicity: document.getElementById('query-ethnicity')?.value || '',
        leftBehind: document.getElementById('query-leftBehind')?.value || ''
    };
    loadStudentList(filters);
}

// 重置查询
function resetQuery() {
    const queryName = document.getElementById('query-name');
    const queryGender = document.getElementById('query-gender');
    const queryEthnicity = document.getElementById('query-ethnicity');
    const queryLeftBehind = document.getElementById('query-leftBehind');
    
    if (queryName) queryName.value = '';
    if (queryGender) queryGender.value = '';
    if (queryEthnicity) queryEthnicity.value = '';
    if (queryLeftBehind) queryLeftBehind.value = '';
    
    loadStudentList();
}

// 查看学生详情
function viewStudent(id) {
    const student = studentStore.getById(id);
    if (!student) return;
    
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

// 编辑学生（跳转到编辑页面）
function editStudent(id) {
    const student = studentStore.getById(id);
    if (!student) return;
    
    // 切换到编辑模块
    const editNav = document.querySelector('[data-module="student-edit"]');
    if (editNav) {
        editNav.click();
    }
    
    // 填充搜索框和表单
    const editSearch = document.getElementById('edit-search');
    if (editSearch) {
        editSearch.value = student.name;
    }
    
    fillEditForm(student);
    
    const editResult = document.getElementById('edit-result');
    if (editResult) {
        editResult.style.display = 'block';
    }
}

// 处理文件上传
function handleFileUpload(file) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('请上传Excel文件', 'error');
        return;
    }
    
    showToast('文件上传成功，正在解析...', 'info');
    
    // 模拟解析
    setTimeout(() => {
        const importPreview = document.getElementById('import-preview');
        const previewTable = document.getElementById('preview-table');
        
        if (importPreview) {
            importPreview.style.display = 'block';
        }
        
        if (previewTable) {
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
        }
        
        showToast('解析完成，请预览确认', 'success');
    }, 1000);
}

// 取消导入
function cancelImport() {
    const importPreview = document.getElementById('import-preview');
    const importFile = document.getElementById('import-file');
    
    if (importPreview) {
        importPreview.style.display = 'none';
    }
    if (importFile) {
        importFile.value = '';
    }
}

// 确认导入
function confirmImport() {
    showToast('正在导入数据...', 'info');
    
    setTimeout(() => {
        // 模拟添加学生
        const newStudents = [
            { 
                id: generateId(), 
                name: '导入学生1', 
                gender: '男', 
                birthdate: '2015-01-01', 
                ethnicity: '汉族', 
                hometown: '北京市', 
                idCard: '110101201501010001', 
                className: '三年级一班', 
                addTime: new Date().toISOString().split('T')[0] 
            },
            { 
                id: generateId(), 
                name: '导入学生2', 
                gender: '女', 
                birthdate: '2015-02-15', 
                ethnicity: '汉族', 
                hometown: '上海市', 
                idCard: '310101201502150002', 
                className: '三年级一班', 
                addTime: new Date().toISOString().split('T')[0] 
            }
        ];
        
        newStudents.forEach(s => studentStore.add(s));
        
        const importPreview = document.getElementById('import-preview');
        const importFile = document.getElementById('import-file');
        
        if (importPreview) {
            importPreview.style.display = 'none';
        }
        if (importFile) {
            importFile.value = '';
        }
        
        showToast('数据导入成功！共导入 2 条记录', 'success');
    }, 1500);
}

// 设置文件上传
function setupFileUpload() {
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
            if (e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        
        importFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

// 初始化学生模块事件
function initStudentEvents() {
    // 学生信息录入表单
    const studentAddForm = document.getElementById('student-add-form');
    if (studentAddForm) {
        studentAddForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            if (addStudent(data)) {
                this.reset();
            }
        });
    }
    
    // 学生信息修改表单
    const studentEditForm = document.getElementById('student-edit-form');
    if (studentEditForm) {
        studentEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;
            delete data.id;
            updateStudent(id, data);
        });
    }
    
    // 设置文件上传
    setupFileUpload();
    
    // 将函数暴露到全局，供HTML内联事件使用
    window.viewStudent = viewStudent;
    window.editStudent = editStudent;
    window.deleteStudent = () => {
        const form = document.getElementById('student-edit-form');
        if (form) {
            const id = form.querySelector('[name="id"]')?.value;
            if (id) {
                deleteStudent(id, () => {
                    const editResult = document.getElementById('edit-result');
                    if (editResult) {
                        editResult.style.display = 'none';
                    }
                    const editSearch = document.getElementById('edit-search');
                    if (editSearch) {
                        editSearch.value = '';
                    }
                });
            }
        }
    };
    window.searchStudentForEdit = searchStudentForEdit;
    window.queryStudents = queryStudents;
    window.resetQuery = resetQuery;
    window.downloadTemplate = downloadTemplate;
    window.cancelImport = cancelImport;
    window.confirmImport = confirmImport;
}

export {
    downloadTemplate,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudentForEdit,
    fillEditForm,
    loadStudentList,
    queryStudents,
    resetQuery,
    viewStudent,
    editStudent,
    handleFileUpload,
    cancelImport,
    confirmImport,
    setupFileUpload,
    initStudentEvents
};
