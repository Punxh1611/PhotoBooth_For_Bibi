            const webcamElement = document.getElementById('webcam');
            const canvasElement = document.createElement('canvas');
            const webcam = new Webcam(webcamElement, 'user', canvasElement);

            webcam.start()
                .then(() => console.log("webcam started"))
                .catch(err => console.error(err));

            const photoContainer = document.getElementById('photo');
            const photos = [];

            // ==================== ตัวแปรสำหรับ Timer ====================
let selectedTimer = 0; // เวลาที่เลือก (เริ่มต้น 0 = ถ่ายทันที)
const timerOverlay = document.getElementById('timer-overlay');
const countdownNumber = document.getElementById('countdown-number');

// ==================== ฟังก์ชันเลือกเวลา ====================
function setTimer(seconds) {
    selectedTimer = seconds;
}
function snapWithTimer() {
    // ถ้าไม่ได้เลือกเวลา หรือเลือก 0 วินาที = ถ่ายทันที
    if (selectedTimer === 0) {
        takepic();
        return;
    }
    
    // แสดง Timer overlay
    timerOverlay.classList.add('show');
    
    let timeLeft = selectedTimer;
    countdownNumber.textContent = timeLeft;
    
    // นับถอยหลังทุก 1 วินาที
    const timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft > 0) {
            // อัปเดตตัวเลข
            countdownNumber.textContent = timeLeft;
            
            // เล่น animation ใหม่
            countdownNumber.style.animation = 'none';
            setTimeout(() => {
                countdownNumber.style.animation = 'pulse 1s ease-in-out';
            }, 10);
            
        } else {
            // หมดเวลา = ถ่ายรูป!
            clearInterval(timerInterval);
            
            // แสดงข้อความ "Smile!" แทนตัวเลข
            countdownNumber.style.fontSize = '150px';
            
            // รอ 0.5 วินาที แล้วถ่ายรูปและซ่อน Timer
            setTimeout(() => {
                takepic();
                timerOverlay.classList.remove('show');
                countdownNumber.style.fontSize = '120px'; // คืนค่าขนาดเดิม
            }, 500);
        }
    }, 1000);
}


function takepic() {
    // สร้าง canvas ความละเอียดสูง
    const customCanvas = document.createElement('canvas');
    const ctx = customCanvas.getContext('2d');
    
    // ตั้งขนาดที่ต้องการ
    customCanvas.width = 707;
    customCanvas.height = 707; // ให้เป็นสี่เหลี่ยมจัตุรัสก่อน
    
    // วาด video ลง canvas (เต็มพื้นที่)
    ctx.drawImage(webcamElement, 0, 0, customCanvas.width, customCanvas.height);
    
    // แปลงเป็น base64 คุณภาพสูง
    let picture = customCanvas.toDataURL('image/png', 1.0);
    photos.push(picture);

    // แสดงภาพตัวอย่าง
    let img = document.createElement('img');
    img.src = picture;
    img.width = 160;
    img.height = 160;
    img.style.border = "2px solid black";
    img.style.margin = "5px";
    photoContainer.appendChild(img);
    
    if (photos.length == 3) {
        console.log("You have taken 3 photos.");
        localStorage.setItem("photos", JSON.stringify(photos));
        setTimeout(() => {
            window.location.href = "frame.html";
        }, 1000);
    }
}

            function downloadAll() {
                photos.forEach((pic, index) => {
                    const link = document.createElement('a');
                    link.href = pic;
                    link.download = `photo_${index + 1}.png`;
                    link.click();
                });
            }