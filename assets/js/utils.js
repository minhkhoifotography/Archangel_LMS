export function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container'); 
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; 
    toast.innerHTML = `<i class="fa-solid fa-circle-info toast-icon"></i><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast); 
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { 
        toast.classList.remove('show'); 
        setTimeout(() => toast.remove(), 300); 
    }, 3000);
}

export function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const icon = input.parentElement.querySelector('.toggle-pw');
    
    if (input.getAttribute('type') === 'password') { 
        input.setAttribute('type', 'text'); 
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else { 
        input.setAttribute('type', 'password'); 
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
    input.focus();
}

export function normalizeStr(str) { 
    if (!str) return ""; 
    return String(str).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim(); 
}

export function getPseudoEmail(username) {
    return normalizeStr(username).replace(/[^a-z0-9]/g, '') + "@corpus.lms";
}

export function getSafeFirebasePass(rawPass) {
    return rawPass + "_corpusLMS";
}
