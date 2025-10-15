const mockProfiles = [
    { id: 1, name: "น้ำฝน", lifestyle: "booklover", score: 90 },
    { id: 2, name: "ธีร์", lifestyle: "healthnut", score: 85 },
    { id: 3, name: "ฟ้าใส", lifestyle: "digitalnomad", score: 70 },
    { id: 4, name: "แดน", lifestyle: "booklover", score: 95 },
    { id: 5, name: "เมย์", lifestyle: "healthnut", score: 60 },
    { id: 6, name: "มานะ", lifestyle: "digitalnomad", score: 92 },
    { id: 7, name: "ก้อย", lifestyle: "booklover", score: 75 }
];

let currentUserProfile = null;
let currentMatchIndex = 0;
let potentialMatches = [];

// ฟังก์ชันสำหรับแปลงค่าไลฟ์สไตล์ให้อ่านง่าย
function formatLifestyle(key) {
    const map = {
        'booklover': 'รักการอ่าน 📚',
        'digitalnomad': 'ทำงานอิสระ/ท่องเที่ยว ✈️',
        'healthnut': 'สายสุขภาพ/ออกกำลังกาย 💪'
    };
    return map[key] || key;
}

// ฟังก์ชัน 1: บันทึกโปรไฟล์ผู้ใช้และตั้งค่าการจับคู่
function saveUserProfile() {
    const name = document.getElementById('user-name').value.trim();
    const lifestyle = document.getElementById('user-lifestyle').value;

    if (!name || !lifestyle) {
        alert("กรุณากรอกชื่อและเลือกไลฟ์สไตล์หลักของคุณก่อน");
        return;
    }

    // 1. บันทึกข้อมูลผู้ใช้ชั่วคราวลงใน Local Storage (จำลองการเข้าสู่ระบบ)
    currentUserProfile = { name: name, lifestyle: lifestyle, matchedIds: [] };
    localStorage.setItem('currentUserProfile', JSON.stringify(currentUserProfile));
    
    // 2. กรองและจัดเรียงโปรไฟล์ที่เข้ากันได้
    potentialMatches = mockProfiles
        .filter(p => p.lifestyle === lifestyle && p.name !== name) // กรองเฉพาะไลฟ์สไตล์ตรงกันและไม่ใช่ตัวเอง
        .sort((a, b) => b.score - a.score); // เรียงตามคะแนนเข้ากันได้สูงไปต่ำ

    if (potentialMatches.length === 0) {
        alert(`ขออภัย! ไม่พบผู้ที่มีไลฟ์สไตล์ "${formatLifestyle(lifestyle)}" อื่น ๆ ในฐานข้อมูลจำลอง`);
        return;
    }

    // 3. เปลี่ยนหน้าจอและเริ่มแสดงโปรไฟล์แรก
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('matching-screen').style.display = 'flex';
    currentMatchIndex = 0;
    showNextProfile();
}

// ฟังก์ชัน 2: แสดงโปรไฟล์ถัดไป
function showNextProfile() {
    if (currentMatchIndex < potentialMatches.length) {
        const profile = potentialMatches[currentMatchIndex];
        
        document.getElementById('match-name').textContent = profile.name;
        document.getElementById('match-lifestyle').textContent = formatLifestyle(profile.lifestyle);
        document.getElementById('match-score').textContent = profile.score;
        
    } else {
        alert("คุณดูโปรไฟล์ที่เข้ากันได้ทั้งหมดแล้ว!");
        // ถ้าดูครบแล้ว ให้ผู้ใช้เริ่มใหม่
        document.getElementById('matching-screen').style.display = 'none';
        document.getElementById('setup-screen').style.display = 'flex';
    }
}

// ฟังก์ชัน 3: การกระทำ "ชอบ"
function likeProfile() {
    if (currentMatchIndex < potentialMatches.length) {
        const likedProfile = potentialMatches[currentMatchIndex];
        
        // Logic การแมตช์จำลอง: ถ้าคะแนนความเข้ากันได้สูง ( > 80) ถือว่า "แมตช์"
        if (likedProfile.score >= 80) {
            document.getElementById('matched-name').textContent = likedProfile.name;
            document.getElementById('matching-screen').style.display = 'none';
            document.getElementById('result-screen').style.display = 'flex';
            // ในระบบจริง: ตรงนี้จะเป็นการบันทึกการแมตช์และเปิดห้องแชท
        } else {
            // แม้จะกดชอบแต่คะแนนต่ำ ก็ยังไม่แมตช์ (แบบ Coffee Meets Bagel)
            currentMatchIndex++;
            showNextProfile();
        }
    }
}

// ฟังก์ชัน 4: การกระทำ "ไม่ชอบ"
function dislikeProfile() {
    currentMatchIndex++;
    showNextProfile();
}

// โหลดโปรไฟล์จาก Local Storage เมื่อเปิดหน้าเว็บ (เพื่อจำผู้ใช้เก่า)
window.onload = function() {
    const savedProfile = localStorage.getItem('currentUserProfile');
    if (savedProfile) {
        // ถ้ามีข้อมูลผู้ใช้ในเบราว์เซอร์แล้ว ให้ตั้งค่าและเริ่มแมตช์เลย
        currentUserProfile = JSON.parse(savedProfile);
        
        // กำหนดค่าในฟอร์มเพื่อเรียกใช้ Logic การจับคู่
        document.getElementById('user-name').value = currentUserProfile.name;
        document.getElementById('user-lifestyle').value = currentUserProfile.lifestyle;
        saveUserProfile();
    }
}
