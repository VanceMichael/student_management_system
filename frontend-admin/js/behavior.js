import { showToast, showConfirm, openModal } from './utils.js';

// ========================================
// 健康记录管理
// ========================================
export function loadHealthRecords() {
    const Store = window.Store;
    const tbody = document.getElementById('health-list');
    
    tbody.innerHTML = Store.getState().healthRecords.map(record => `
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

export function showHealthModal(record = null) {
    const Store = window.Store;
    const isEdit = record !== null;
    
    openModal(isEdit ? '编辑健康记录' : '添加健康记录', `
        <form id="health-form" class="modal-form">
            <input type="hidden" name="id" value="${record?.id || ''}">
            <div class="form-group">
                <label>学生姓名</label>
                <select name="studentId" required>
                    <option value="">请选择学生</option>
                    ${Store.getState().students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
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

export function saveHealthRecord() {
    const form = document.getElementById('health-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.id == data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        Store.updateHealthRecord(data.id, data);
    } else {
        Store.addHealthRecord(data);
    }
    
    closeModal();
    loadHealthRecords();
    showToast('保存成功！', 'success');
}

export function editHealthRecord(id) {
    const Store = window.Store;
    const record = Store.getState().healthRecords.find(r => r.id == id);
    if (record) {
        showHealthModal(record);
    }
}

export function deleteHealthRecord(id) {
    showConfirm('确定要删除该健康记录吗？', () => {
        const Store = window.Store;
        Store.deleteHealthRecord(id);
        loadHealthRecords();
        showToast('删除成功！', 'success');
    });
}

// ========================================
// 奖惩记录管理
// ========================================
export function loadRewardRecords(filter = 'all') {
    const Store = window.Store;
    let records = [...Store.getState().rewardRecords];
    
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

export function showRewardModal(type, record = null) {
    const Store = window.Store;
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
                    ${Store.getState().students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
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
                <input type="text" name="recorder" value="${record?.recorder || Store.getState().currentUser?.username || ''}" required>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveRewardRecord()">保存</button>
    `);
}

export function saveRewardRecord() {
    const form = document.getElementById('reward-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.id == data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        Store.updateRewardRecord(data.id, data);
    } else {
        Store.addRewardRecord(data);
    }
    
    closeModal();
    loadRewardRecords();
    showToast('保存成功！', 'success');
}

export function editRewardRecord(id) {
    const Store = window.Store;
    const record = Store.getState().rewardRecords.find(r => r.id == id);
    if (record) {
        showRewardModal(record.type, record);
    }
}

export function deleteRewardRecord(id) {
    showConfirm('确定要删除该记录吗？', () => {
        const Store = window.Store;
        Store.deleteRewardRecord(id);
        loadRewardRecords();
        showToast('删除成功！', 'success');
    });
}

// ========================================
// 成长档案管理
// ========================================
export function searchGrowthRecord() {
    const keyword = document.getElementById('growth-search').value.trim();
    if (!keyword) {
        showToast('请输入学生姓名', 'warning');
        return;
    }
    
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.name.includes(keyword));
    if (student) {
        loadGrowthProfile(student);
    } else {
        showToast('未找到该学生', 'warning');
        document.getElementById('growth-profile').style.display = 'none';
    }
}

export function loadGrowthProfile(student) {
    document.getElementById('growth-profile').style.display = 'block';
    document.getElementById('growth-avatar').textContent = student.name.charAt(0);
    document.getElementById('growth-name').textContent = student.name;
    document.getElementById('growth-class').textContent = student.className;
    
    const Store = window.Store;
    const records = Store.getState().growthRecords.filter(r => r.studentId == student.id);
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

export function showGrowthModal() {
    const studentName = document.getElementById('growth-name').textContent;
    const Store = window.Store;
    const student = Store.getState().students.find(s => s.name === studentName);
    
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

export function saveGrowthRecord() {
    const form = document.getElementById('growth-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const Store = window.Store;
    Store.addGrowthRecord(data);
    
    closeModal();
    
    const student = Store.getState().students.find(s => s.id == data.studentId);
    if (student) {
        loadGrowthProfile(student);
    }
    
    showToast('成长记录已添加！', 'success');
}

window.loadHealthRecords = loadHealthRecords;
window.showHealthModal = showHealthModal;
window.saveHealthRecord = saveHealthRecord;
window.editHealthRecord = editHealthRecord;
window.deleteHealthRecord = deleteHealthRecord;
window.loadRewardRecords = loadRewardRecords;
window.showRewardModal = showRewardModal;
window.saveRewardRecord = saveRewardRecord;
window.editRewardRecord = editRewardRecord;
window.deleteRewardRecord = deleteRewardRecord;
window.searchGrowthRecord = searchGrowthRecord;
window.loadGrowthProfile = loadGrowthProfile;
window.showGrowthModal = showGrowthModal;
window.saveGrowthRecord = saveGrowthRecord;