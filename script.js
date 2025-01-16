async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    const loading = document.getElementById('loading');

    if (!passwordInput.value) {
        showAlert('Silakan masukkan password');
        return;
    }

    // Tampilkan loading
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    try {
        // Buat SHA-1 hash dari password
        const hash = await sha1(passwordInput.value);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5).toUpperCase();

        // Panggil API HIBP
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        
        // Cari jumlah kemunculan
        const hashes = data.split('\n');
        const match = hashes.find(h => h.split(':')[0] === suffix);
        const count = match ? parseInt(match.split(':')[1]) : 0;

        // Tampilkan hasil
        resultDiv.classList.remove('hidden');
        if (count > 0) {
            resultContent.innerHTML = `
                <div class="text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Password Tidak Aman!</h3>
                    <p>Password ini telah muncul dalam ${count.toLocaleString()} kebocoran data.</p>
                    <p class="mt-2">Sebaiknya ganti password Anda segera!</p>
                </div>
            `;
        } else {
            resultContent.innerHTML = `
                <div class="text-green-500">
                    <i class="fas fa-shield-alt text-4xl mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Password Aman!</h3>
                    <p>Password ini belum pernah muncul dalam kebocoran data yang diketahui.</p>
                </div>
            `;
        }
    } catch (error) {
        resultContent.innerHTML = `
            <div class="text-red-500">
                <i class="fas fa-times-circle text-4xl mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Terjadi Kesalahan</h3>
                <p>Mohon coba lagi nanti.</p>
            </div>
        `;
    } finally {
        loading.classList.add('hidden');
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Fungsi untuk membuat SHA-1 hash
async function sha1(str) {
    const buffer = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', buffer);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Event listener untuk input ketika user menekan Enter
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function showAlert(message) {
    const modal = document.getElementById('alertModal');
    const modalContent = document.getElementById('modalContent');
    const messageElement = document.getElementById('alertMessage');
    
    messageElement.textContent = message;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Animasi masuk
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeAlert() {
    const modal = document.getElementById('alertModal');
    const modalContent = document.getElementById('modalContent');
    
    // Animasi keluar
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 150);
}

// Tambahkan event listener untuk menutup modal dengan tombol Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAlert();
    }
});

// Tambahkan event listener untuk menutup modal ketika mengklik di luar modal
document.getElementById('alertModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAlert();
    }
});

function showPrivacyInfo() {
    const modal = document.getElementById('privacyModal');
    const content = document.getElementById('privacyContent');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Animasi masuk
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closePrivacyInfo() {
    const modal = document.getElementById('privacyModal');
    const content = document.getElementById('privacyContent');
    
    // Animasi keluar
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 150);
}

// Tambahkan event listener untuk menutup modal privasi dengan tombol Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePrivacyInfo();
    }
});

// Tambahkan event listener untuk menutup modal privasi ketika mengklik di luar modal
document.getElementById('privacyModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePrivacyInfo();
    }
}); 