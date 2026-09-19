import { initFirebase, setCloudStatus, db, isCloudConnected } from './firebase-config.js';
import { showToast, togglePasswordVisibility, normalizeStr } from './utils.js';

// --- BIẾN TOÀN CỤC (GLOBAL STATE) ---
window.state = { teams: [], settings: {}, rawList: [] };
window.currentUser = null;
window.activeYear = localStorage.getItem('LMS_ACTIVE_YEAR_V44') || "";
window.systemYears = [];

// Khởi chạy hệ thống khi trang load xong
document.addEventListener('DOMContentLoaded', async () => {
    initFirebase();
    
    // Đổ dữ liệu năm học và lớp học (Giữ logic cũ của bạn ở đây)
    // Code logic khởi tạo giao diện ở đây...
    
    // Đồng hồ
    setInterval(() => { 
        let el = document.getElementById('currentTime'); 
        if(el && window.innerWidth > 576) { 
            document.getElementById('desktopClock').style.display = 'block'; 
            el.innerText = new Date().toLocaleString('vi-VN'); 
        } else { 
            document.getElementById('desktopClock').style.display = 'none'; 
        }
    }, 1000);
});

// --- EXPORT HÀM RA WINDOW ĐỂ HTML GỌI ĐƯỢC (Rất quan trọng) ---
window.showToast = showToast;
window.togglePasswordVisibility = togglePasswordVisibility;
window.setCloudStatus = setCloudStatus;

window.toggleSidebar = function() { 
    document.querySelector('.sidebar').classList.toggle('active'); 
    document.querySelector('.sidebar-overlay').classList.toggle('active'); 
};

window.toggleAuthForm = function() {
    const loginBox = document.getElementById('loginFormBox'); 
    const regBox = document.getElementById('registerFormBox');
    if(loginBox.style.display === 'none') { 
        loginBox.style.display = 'block'; regBox.style.display = 'none'; 
    } else { 
        loginBox.style.display = 'none'; regBox.style.display = 'block'; 
    }
};

window.clearCache = function() {
    if(confirm("XÓA SẠCH VÀ KHÔI PHỤC CÀI ĐẶT GỐC? Bạn sẽ mất dữ liệu Local nếu chưa kịp đồng bộ lên Cloud!")) {
        localStorage.clear(); location.reload();
    }
};

// Lưu ý: Bạn sẽ tiếp tục copy các hàm như login(), register(), switchTab() 
// từ file cũ sang đây và gán "window.tenHam = function() { ... }" tương tự như trên.
