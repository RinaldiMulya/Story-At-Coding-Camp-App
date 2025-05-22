// File: scripts/components/camera.js

// Komponen untuk mengelola akses dan kontrol kamera
export default class CameraComponent {
    constructor({
        onPhotoCaptured = () => {}, // Callback saat foto diambil
        videoSelector = '#camera-preview',
        canvasSelector = '#photo-canvas',
        imageSelector = '#captured-photo',
        selectSelector = '#camera-select',
    } = {}) {
        this.stream = null; // Stream kamera aktif
        this.photoTaken = false;
        // Ambil elemen DOM berdasarkan selector
        this.videoElement = document.querySelector(videoSelector);
        this.photoCanvas = document.querySelector(canvasSelector);
        this.capturedPhoto = document.querySelector(imageSelector);
        this.cameraSelect = document.querySelector(selectSelector);
        this.onPhotoCaptured = onPhotoCaptured;
    }

    // Inisialisasi dengan mengisi dropdown kamera
    async init() {
        await this.populateCameraOptions();
    }

    // Mendapatkan daftar kamera dan mengisinya ke dalam <select>
    async populateCameraOptions() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        this.cameraSelect.innerHTML = ''; // Kosongkan dropdown
        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${this.cameraSelect.length + 1}`;
            this.cameraSelect.appendChild(option);
        });
    }

    // Menyalakan kamera sesuai dengan kamera yang dipilih
    async startCamera() {
        const selectedDeviceId = this.cameraSelect.value;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
                audio: false,
            });

            this.videoElement.srcObject = this.stream; // Set stream ke <video>
            this.videoElement.style.display = 'block';
        } catch (error) {
            console.error('Gagal mengakses kamera:', error);
            alert('Tidak dapat mengakses kamera. Pastikan Anda memberi izin.');
        }
    }

    // Ambil gambar dari video dan tampilkan
    capturePhoto() {
        const context = this.photoCanvas.getContext('2d');
        this.photoCanvas.width = this.videoElement.videoWidth;
        this.photoCanvas.height = this.videoElement.videoHeight;
        context.drawImage(this.videoElement, 0, 0); // Salin gambar ke canvas

        const photoData = this.photoCanvas.toDataURL('image/jpeg'); // Konversi ke base64
        this.capturedPhoto.src = photoData; // Tampilkan ke <img>
        this.capturedPhoto.style.display = 'block';
        this.videoElement.style.display = 'none'; // Sembunyikan preview
        this.stopCamera(); // Matikan kamera
        this.photoTaken = true;

        // Panggil callback dengan data gambar
        if (typeof this.onPhotoCaptured === 'function') {
            this.onPhotoCaptured(photoData);
        }
    }

    // Memberhentikan semua stream dari kamera
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop()); // Stop semua track
            this.stream = null;
        }
    }
}
