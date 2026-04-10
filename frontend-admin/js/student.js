import { showToast, showConfirm } from './utils.js';

export function downloadTemplate() {
    showToast('模板下载中...', 'info');
    setTimeout(() => {
        showToast('模板下载成功！', 'success');
    }, 1000);
}

export function addStudent(formData) {
    const Store = window.Store;
    const student = {
        ...formData,
        className: '三年级一班',
        addTime: new Date().toISOString().split('T')[0]
    };
    
    Store.addStudent(student);
    showToast('学生信息添加成功！', 'success');
    return true;
}

export function updateStudent(id, formData) {
    const Store = window.Store;
    const result = Store.updateStudent(id, formData);
    
    if (result) {
        showToast('学生信息更新成功！', 'success');
    }
    return result;
}

export function deleteStudent() {
    const form = document.getElementById('student-edit-form');
    const id = form.querySelector('[name="id"]').value;
    
    showConfirm('确定要删除该学生信息吗？此操作不可恢复。', () => {
        const Store = window.Store;
        Store.deleteStudent(id);
        showToast('学生信息已删除', 'success');
        document.getElementById('edit-result').style.display = 'none';
    });
}

export function searchStudentForEdit() {
    const keyword = document.getElementById('edit-search').value.trim();
    
    if (!keyword) {
        showToast('请输入搜索关键词', 'warning');
        return;
    }
    
    const Store = window.Store;
    const student = Store.getState().students.find(s => 
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

export function fillEditForm(student) {
    const form = document.getElementById('student-edit-form');
    Object.keys(student).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = student[key];
        }
    });
}

export function loadStudentList(filters = {}) {
    const Store = window.Store;
    let students = [...Store.getState().students];
    
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

export function queryStudents() {
    const filters = {
        name: document.getElementById('query-name').value,
        gender: document.getElementById('query-gender').value,
        ethnicity: document.getElementById('query-ethnicity').value,
        leftBehind: document.getElementById('query-leftBehind').value
    };
    loadStudentList(filters);
}

export function resetQuery() {
    document.getElementById('query-name').value = '';
    document.getElementById('query-gender').value = '';
    document.getElementById('query-ethnicity').value = '';
    document.getElementById('query-leftBehind').value = '';
    loadStudentList();
}

export function viewStudent(id) {
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.id == id);
    
    if (student) {
        window.openModal('学生详细信息', `
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

export function editStudent(id) {
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.id == id);
    
    if (student) {
        window.switchModule('student-edit');
        document.getElementById('edit-search').value = student.name;
        fillEditForm(student);
        document.getElementById('edit-result').style.display = 'block';
    }
}

window.downloadTemplate = downloadTemplate;
window.addStudent = addStudent;
window.updateStudent = updateStudent;
window.deleteStudent = deleteStudent;
window.searchStudentForEdit = searchStudentForEdit;
window.fillEditForm = fillEditForm;
window.loadStudentList = loadStudentList;
window.queryStudents = queryStudents;
window.resetQuery = resetQuery;
window.viewStudent = viewStudent;
window.editStudent = editStudent;