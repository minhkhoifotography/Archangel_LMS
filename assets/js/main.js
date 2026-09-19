import { initFirebase, setCloudStatus, db, isCloudConnected } from './firebase-config.js';
import { showToast, togglePasswordVisibility, normalizeStr, getPseudoEmail, getSafeFirebasePass } from './utils.js';

// ==========================================
// PHẦN 1: CHÉP CÁC BIẾN TOÀN CỤC (GLOBAL VARIABLES)
// ==========================================
const SYSTEM_YEARS_KEY = "LMS_YEARS_V44";
const AUTH_KEY = "LMS_AUTH_V44"; 
const CLASS_PREFIX = "LMS_CLASS_V44_";
const REQUESTS_KEY = "LMS_REQUESTS_V44_";
const SAINT_NAMES = ["maria", "giuse", "phêrô", "anna", "têrêsa", "gioan", "baotixita", "phanxicô", "assisi", "đaminh", "lucia", "luca", "phaolô", "bênêđictô", "mácta", "mátthêu", "máccô", "cêcilia", "catarina", "antôn", "micae", "mác-ta", "mác-cô", "tê-rê-sa"];
const ATT_ERRORS = [
    { id: 'present', label: 'Có Mặt', point: 0 }, { id: 'cp', label: 'Có Phép', point: -0.5 }, { id: 'kp', label: 'Không Phép', point: -1.0 },
    { id: 'tp', label: 'Tác Phong', point: -0.25 }, { id: 'dt', label: 'Đi Trễ', point: -0.25 }, { id: 'lp', label: 'Thiếu Lễ Phép', point: -1.0 }
];
const CRITERIA = {
    student: [ { id: 'phatBieu', name: 'Phát biểu', point: 1 }, { id: 'thuocBai', name: 'Thuộc bài', point: 2 }, { id: 'viecRieng', name: 'Vi phạm trật tự', point: -1 }, { id: 'voLe', name: 'Vô lễ', point: -3 } ],
    team: [ { id: 'thuoc100', name: '100% Hoàn thành', point: 5 }, { id: 'troChoi', name: 'Giải thưởng', point: 5 }, { id: 'trucNhat', name: 'Vệ sinh', point: 3 }, { id: 'matTratTu', name: 'Mất trật tự', point: -3 }, { id: 'viTien', name: 'Ví Tiền (Cộng trong giờ)', point: 1 } ]
};
const ICONS = ["🍉","🌻","🐬","🍀","🦊","🐼","🍓","🌼"];

let systemYears = []; let activeYear = localStorage.getItem('LMS_ACTIVE_YEAR_V44') || "";
let authDB = {}; let globalUsers = []; let roleRequests = []; let state = { teams: [], settings: {}, rawList: [] };
let currentUser = null; let currentViewClass = null; let currentSheet = 'hk1'; let chartInstance = null, studentChartInstance = null;
let CHI_DOAN_LIST = ["Chiên 1A","Chiên 1B","Chiên 2A","Chiên 2B","Ấu 1A","Ấu 1B","Ấu 1C","Ấu 2A","Ấu 2B","Ấu 2C", "Thiếu 1A","Thiếu 1B","Thiếu 1C","Thiếu 2A","Thiếu 2B","Thiếu 2C","Thiếu 3A","Thiếu 3B","Thiếu 3C", "Nghĩa 1","Nghĩa 2","Hiệp 1","Hiệp 2","Dự Trưởng", "Hệ Thống Admin"];
const DUTY_LIST = ["Chưa phân công", "Xứ đoàn Trưởng", "Xứ đoàn phó", "Thư ký", "Thủ quỹ", "Trưởng ngành Chiên", "Trưởng ngành Ấu", "Trưởng ngành Thiếu", "Trưởng ngành Nghĩa", "Trưởng ngành Hiệp", "Phó ngành Chiên", "Phó ngành Ấu", "Phó ngành Thiếu", "Phó ngành Nghĩa", "Phó ngành Hiệp", "Thành viên ngành Chiên", "Thành viên ngành Ấu", "Thành viên ngành Thiếu", "Thành viên ngành Nghĩa", "Thành viên ngành Hiệp"];
const COMMITTEE_LIST = ["Chưa phân công","Ban Điều Hành", "Ban Phụng Vụ", "Ban Trực", "Ban Sinh Hoạt", "Ban Học Vụ", "Ban Truyền Thông", "Ban Bác Ái", "Ban Kỹ Thuật"];
const BANG_CAP_LIST = ["Dự Trưởng", "HT-GLV Cấp 1", "HT-GLV Cấp 2", "HT-GLV Cấp 3", "Huấn Luyện Viên", "HT-GLPT"];
const DEFAULT_AUTH = { "admin": "1", "maria phan trần thanh thảo": "1", "micae lưu minh khôi": "1", "maria phạm trần kim anh": "1" };
const DEFAULT_USERS = [
    { username: "admin", chidoan: "Hệ Thống Admin", role: "admin" },
    { username: "Maria Phan Trần Thanh Thảo", chidoan: "Thiếu 3C", role: "lead" },
    { username: "Micae Lưu Minh Khôi", chidoan: "Thiếu 3C", role: "assistant" },
    { username: "Maria Phạm Trần Kim Anh", chidoan: "Thiếu 3C", role: "collab" }
];

// Khai báo biến riêng cho Task và Wheel
let globalTasks = []; let currentOpenTaskId = null; let storage = null;
let wheelNames = []; let wheelColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];
let startAngle = 0; let arc = 0; let spinTimeout = null; let constantSpinSpeed = 45; 
let isSpinning = false; let isSlowingDown = false; let spinAngleStart = 0; let spinTime = 0; let spinTimeTotal = 0; let ctxWheel = null; let lastWinnerIndex = -1;
let deleteTargetType = ''; let targetNameToDelete = '';
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ==========================================
// PHẦN 2: CHÉP TOÀN BỘ CÁC HÀM XỬ LÝ (FUNCTIONS) TỪ DÒNG 800 ĐẾN HẾT
// ==========================================
// Bạn copy paste nguyên xi tất cả các hàm từ code cũ vào đây, bao gồm:
// - toArray(), normalizeData(), fetchFromDB(), saveToDB(), forceSync(), clearCache()
// - register(), login(), submitNewPassword(), changeMyPassword(), logout(), finishLogin()
// - setupRealtimeListeners(), renderCurrentTab(), changeAcademicYear(), switchClass(), switchTab()
// - renderDashboard(), renderStudentProfiles(), addNewStudentRow(), updateStudentProfile(), deleteStudent(), deleteAllStudents()
// - renderAttendance(), saveAttendanceManual(), switchSheet(), renderAcademicGrades(), updateAcademic(), toggleLockSheet()
// - renderBehaviorTeams(), initSortableTeams(), moveStudentDragDrop(), moveStudentToNewTeam(), createNewEmptyTeam()
// - updatePoint(), updateTeamPoint(), updateTeamWallet(), showMoneyHistory(), deleteMoneyTransaction()
// - showHistory(), closeHistory(), deleteHistoryRecord()
// - handleFileUpload(), generateNewClass(), backupData(), restoreData(), rebuildFromCloudList()
// - Các hàm xuất Excel: exportToCSV(), exportStudentProfiles(), exportAcademicSheet(), exportGLVProfiles()
// - Các hàm Wheel of Fortune: initWheel(), drawWheel(), spinWheel(), rotateWheel(), stopRotateWheel(), playTickSound()
// - Các hàm Tasks: initTaskDropdowns(), toggleAllScopes(), toggleTaskTypeUI(), openCreateTaskModal(), submitNewTask()...
// (KHÔNG COPY CÁC HÀM ĐÃ ĐƯA VÀO UTILS NHƯ togglePasswordVisibility)

/* ---- DÁN CODE CÁC HÀM CỦA BẠN VÀO KHU VỰC NÀY ---- */


// ==========================================
// PHẦN 3: LOGIC KHỞI CHẠY (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initFirebase();
    if (typeof firebase !== 'undefined') {
        try { storage = firebase.storage(); } catch (e) { console.log("Firebase Storage Init Error", e); }
    }

    const adminSelect = document.getElementById('adminTopClassSelect'); 
    const regSelect = document.getElementById('regChiDoan');
    CHI_DOAN_LIST.forEach(cd => { 
        if(adminSelect) adminSelect.innerHTML += `<option value="${cd}">${cd}</option>`; 
        if(regSelect && cd !== "Hệ Thống Admin") regSelect.innerHTML += `<option value="${cd}">${cd}</option>`; 
    });
    if(adminSelect) adminSelect.innerHTML += `<option value="add_new_class" style="font-weight: bold; color: #059669;">+ Thêm lớp mới...</option>`;
    
    try { systemYears = JSON.parse(localStorage.getItem(SYSTEM_YEARS_KEY)) || ["2025-2026", "2026-2027"]; } catch(e) { systemYears = ["2025-2026", "2026-2027"]; }
    
    setTimeout(async () => {
        let sYears = await fetchFromDB('system/years', systemYears); systemYears = toArray(sYears);
        if(systemYears.length === 0) systemYears = ["2025-2026", "2026-2027"];
        authDB = await fetchFromDB('auth', DEFAULT_AUTH);
        saveToDB('auth', authDB); saveToDB('system/years', systemYears);
        
        // Cần copy hàm renderYearDropdowns() vào phần 2 để gọi được ở đây
        if(typeof renderYearDropdowns === 'function') renderYearDropdowns(); 
    }, 100);

    setInterval(() => { 
        let el = document.getElementById('currentTime'); 
        if(el && window.innerWidth > 576) { document.getElementById('desktopClock').style.display = 'block'; el.innerText = new Date().toLocaleString('vi-VN'); } 
        else { document.getElementById('desktopClock').style.display = 'none'; }
    }, 1000);
    
    let attDateEl = document.getElementById('attDate'); 
    if(attDateEl) {
        const today = new Date();
        attDateEl.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
});


// ==========================================
// PHẦN 4: EXPORT RA BÊN NGOÀI ĐỂ HTML GỌI ĐƯỢC (BẮT BUỘC)
// ==========================================
window.toggleSidebar = function() { document.querySelector('.sidebar').classList.toggle('active'); document.querySelector('.sidebar-overlay').classList.toggle('active'); };
window.toggleAuthForm = function() {
    const loginBox = document.getElementById('loginFormBox'); const regBox = document.getElementById('registerFormBox');
    if(loginBox.style.display === 'none') { loginBox.style.display = 'block'; regBox.style.display = 'none'; } else { loginBox.style.display = 'none'; regBox.style.display = 'block'; }
};
window.togglePasswordVisibility = togglePasswordVisibility; // Lấy từ utils
window.clearCache = clearCache;

// Auth
window.login = login;
window.register = register;
window.logout = logout;
window.submitNewPassword = submitNewPassword;
window.changeMyPassword = changeMyPassword;

// Navigation & Year/Class Select
window.switchTab = switchTab;
window.changeAcademicYear = changeAcademicYear;
window.switchClass = switchClass;
window.switchSheet = switchSheet;

// Sync & Backup
window.forceSync = forceSync;
window.backupData = backupData;
window.restoreData = restoreData;
window.handleFileUpload = handleFileUpload;
window.generateNewClass = generateNewClass;
window.rebuildFromCloudList = rebuildFromCloudList;

// Students & Teams
window.addNewStudentRow = addNewStudentRow;
window.updateStudentProfile = updateStudentProfile;
window.deleteStudent = deleteStudent;
window.deleteAllStudents = deleteAllStudents;
window.updatePoint = updatePoint;
window.updateTeamPoint = updateTeamPoint;
window.updateTeamWallet = updateTeamWallet;
window.showMoneyHistory = showMoneyHistory;
window.deleteMoneyTransaction = deleteMoneyTransaction;
window.toggleFlag = toggleFlag;
window.toggleRole = toggleRole;
window.updateTeamName = updateTeamName;
window.createNewEmptyTeam = createNewEmptyTeam;

// Attendance & Academic
window.renderAttendance = renderAttendance;
window.saveAttendanceManual = saveAttendanceManual;
window.showHistory = showHistory;
window.closeHistory = closeHistory;
window.deleteHistoryRecord = deleteHistoryRecord;
window.updateAcademic = updateAcademic;
window.toggleLockSheet = toggleLockSheet;

// Tasks & Wheel
window.openCreateTaskModal = openCreateTaskModal;
window.submitNewTask = submitNewTask;
window.toggleAllScopes = toggleAllScopes;
window.toggleTaskTypeUI = toggleTaskTypeUI;
window.openTaskDetail = openTaskDetail;
window.submitTaskProof = submitTaskProof;
window.deleteTask = deleteTask;
window.reviewTask = reviewTask;
window.toggleNotiDropdown = toggleNotiDropdown;
window.markAllRead = markAllRead;
window.spinWheel = spinWheel;
window.initWheel = initWheel;
window.closeWinnerModal = closeWinnerModal;

// Admin & GLV
window.addGLVToClass = addGLVToClass;
window.removeGLVFromClass = removeGLVFromClass;
window.updateUserField = updateUserField;
window.requestRoleChange = requestRoleChange;
window.handleRequest = handleRequest;
window.handleAdminMassAssignment = handleAdminMassAssignment;
window.downloadAdminTemplate = downloadAdminTemplate;
window.saveLockDeadline = saveLockDeadline;
window.updateGLVProfile = updateGLVProfile;
window.updateGLVUsername = updateGLVUsername;
window.addNewGLVRow = addNewGLVRow;
window.deleteGLV = deleteGLV;
window.adminUpdatePassword = adminUpdatePassword;

// Delete Modals
window.startDeleteProcess = startDeleteProcess;
window.nextDeleteStep = nextDeleteStep;
window.closeDeleteModal = closeDeleteModal;
window.executeDelete = executeDelete;

// Exports
window.exportToCSV = exportToCSV;
window.exportStudentProfiles = exportStudentProfiles;
window.exportAcademicSheet = exportAcademicSheet;
window.exportGLVProfiles = exportGLVProfiles;
