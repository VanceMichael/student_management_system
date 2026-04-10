/**
 * 行为管理模块 - Behavior
 * 处理健康记录、奖惩记录、成长档案等功能
 */

import { healthStore, rewardStore, growthStore, studentStore, getCurrentUser } from './store.js';
import { generateId } from './utils.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { showConfirm } from '../components/confirm.js';

// ==================== 健康记录管理 ====================

// 加载健康记录列表
function loadHealthRecords() {
    const tbody = document.getElementById('health-list');
    if (!tbody) return;
    
    tbody.innerHTML = healthStore.getAll().map(record => `
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
                    <button class="btn-edit" onclick="window.editHealthRecord(${record.id})">编辑</button>
                    <button class="btn-delete" onclick="window.deleteHealthRecord(${record.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 显示健康记录弹窗
function showHealthModal(record = null) {
    const isEdit = record !== null;
    const students = studentStore.getAll();
    
    openModal(isEdit ? '编辑健康记录' : '添加健康记录', `
        <form id="health-form" class="modal-form">
            <input type="hidden" name="id" value="${record?.id || ''}">
            <div class="form-group">
                <label>学生姓名</label>
                <select name="studentId" required>
                    <option value="">请选择学生</option>
                    ${students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
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
        <button class="btn btn-secondary" onclick="window.closeHealthModal()">取消</button>
        <button class="btn btn-primary" onclick="window.saveHealthRecord()">保存</button>
    `);
}

// 保存健康记录
function saveHealthRecord() {
    const form = document.getElementById('health-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const student = studentStore.getById(data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        healthStore.update(data.id, data);
    } else {
        data.id = generateId();
        healthStore.add(data);
    }
    
    closeModal();
    loadHealthRecords();
    showToast('保存成功！', 'success');
}

// 编辑健康记录
function editHealthRecord(id) {
    const record = healthStore.getById(id);
    if (record) {
        showHealthModal(record);
    }
}

// 删除健康记录
function deleteHealthRecord(id) {
    showConfirm('确定要删除该健康记录吗？', () => {
        if (healthStore.delete(id)) {
            loadHealthRecords();
            showToast('删除成功！', 'success');
        }
    });
}

// ==================== 奖惩记录管理 ====================

// 加载奖惩记录列表
function loadRewardRecords(filter = 'all') {
    let records = rewardStore.getAll();
    
    if (filter !== 'all') {
        records = records.filter(r => r.type === filter);
    }
    
    const tbody = document.getElementById('reward-list');
    if (!tbody) return;
    
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
                    <button class="btn-edit" onclick="window.editRewardRecord(${record.id})">编辑</button>
                    <button class="btn-delete" onclick="window.deleteRewardRecord(${record.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 显示奖惩记录弹窗
function showRewardModal(type, record = null) {
    const isEdit = record !== null;
    const recordType = isEdit ? record.type : type;
    const students = studentStore.getAll();
    const currentUser = getCurrentUser();
    
    openModal(isEdit ? '编辑记录' : (recordType === 'reward' ? '添加奖励' : '添加惩罚'), `
        <form id="reward-form" class="modal-form">
            <input type="hidden" name="id" value="${record?.id || ''}">
            <input type="hidden" name="type" value="${recordType}">
            <div class="form-group">
                <label>学生姓名</label>
                <select name="studentId" required>
                    <option value="">请选择学生</option>
                    ${students.map(s => `<option value="${s.id}" ${record?.studentId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
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
                <input type="text" name="recorder" value="${record?.recorder || currentUser?.username || ''}" required>
            </div>
        </form>
    `, `
        <button class="btn btn-secondary" onclick="window.closeRewardModal()">取消</button>
        <button class="btn btn-primary" onclick="window.saveRewardRecord()">保存</button>
    `);
}

// 保存奖惩记录
function saveRewardRecord() {
    const form = document.getElementById('reward-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const student = studentStore.getById(data.studentId);
    data.studentName = student ? student.name : '';
    
    if (data.id) {
        rewardStore.update(data.id, data);
    } else {
        data.id = generateId();
        rewardStore.add(data);
    }
    
    closeModal();
    loadRewardRecords();
    showToast('保存成功！', 'success');
}

// 编辑奖惩记录
function editRewardRecord(id) {
    const record = rewardStore.getById(id);
    if (record) {
        showRewardModal(record.type, record);
    }
}

// 删除奖惩记录
function deleteRewardRecord(id) {
    showConfirm('确定要删除该记录吗？', () => {
        if (rewardStore.delete(id)) {
            loadRewardRecords();
            showToast('删除成功！', 'success');
        }
    });
}

// ==================== 成长档案管理 ====================

// 搜索成长记录
function searchGrowthRecord() {
    const keyword = document.getElementById('growth-search')?.value.trim();
    if (!keyword) {
        showToast('请输入学生姓名', 'warning');
        return;
    }
    
    const student = studentStore.getAll().find(s => s.name.includes(keyword));
    if (student) {
        loadGrowthProfile(student);
    } else {
        showToast('未找到该学生', 'warning');
        const growthProfile = document.getElementById('growth-profile');
        if (growthProfile) {
            growthProfile.style.display = 'none';
        }
    }
}

// 加载成长档案
function loadGrowthProfile(student) {
    const growthProfile = document.getElementById('growth-profile');
    const growthAvatar = document.getElementById('growth-avatar');
    const growthName = document.getElementById('growth-name');
    const growthClass = document.getElementById('growth-class');
    const growthTimeline = document.getElementById('growth-timeline');
    
    if (growthProfile) growthProfile.style.display = 'block';
    if (growthAvatar) growthAvatar.textContent = student.name.charAt(0);
    if (growthName) growthName.textContent = student.name;
    if (growthClass) growthClass.textContent = student.className;
    
    const records = growthStore.getByStudentId(student.id);
    
    if (growthTimeline) {
        growthTimeline.innerHTML = records.map(record => `
            <div class="timeline-item">
                <div class="timeline-date">${record.date}</div>
                <div class="timeline-content">
                    <h5>${record.title}</h5>
                    <p>${record.content}</p>
                </div>
            </div>
        `).join('') || '<p style="color: var(--text-muted); text-align: center;">暂无成长记录</p>';
    }
}

// 显示成长记录弹窗
function showGrowthModal() {
    const studentName = document.getElementById('growth-name')?.textContent;
    const student = studentStore.getAll().find(s => s.name === studentName);
    
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
        <button class="btn btn-secondary" onclick="window.closeGrowthModal()">取消</button>
        <button class="btn btn-primary" onclick="window.saveGrowthRecord()">保存</button>
    `);
}

// 保存成长记录
function saveGrowthRecord() {
    const form = document.getElementById('growth-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    data.id = generateId();
    growthStore.add(data);
    
    closeModal();
    
    const student = studentStore.getById(data.studentId);
    if (student) {
        loadGrowthProfile(student);
    }
    
    showToast('成长记录添加成功！', 'success');
}

// ==================== 初始化事件 ====================

function initBehaviorEvents() {
    // 奖惩记录标签页
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadRewardRecords(this.dataset.tab);
        });
    });
    
    // 暴露函数到全局
    window.showHealthModal = () => showHealthModal();
    window.editHealthRecord = editHealthRecord;
    window.deleteHealthRecord = deleteHealthRecord;
    window.saveHealthRecord = saveHealthRecord;
    window.closeHealthModal = closeModal;
    
    window.showRewardModal = showRewardModal;
    window.editRewardRecord = editRewardRecord;
    window.deleteRewardRecord = deleteRewardRecord;
    window.saveRewardRecord = saveRewardRecord;
    window.closeRewardModal = closeModal;
    
    window.searchGrowthRecord = searchGrowthRecord;
    window.showGrowthModal = showGrowthModal;
    window.saveGrowthRecord = saveGrowthRecord;
    window.closeGrowthModal = closeModal;
}

export {
    loadHealthRecords,
    showHealthModal,
    saveHealthRecord,
    editHealthRecord,
    deleteHealthRecord,
    loadRewardRecords,
    showRewardModal,
    saveRewardRecord,
    editRewardRecord,
    deleteRewardRecord,
    searchGrowthRecord,
    loadGrowthProfile,
    showGrowthModal,
    saveGrowthRecord,
    initBehaviorEvents
};
