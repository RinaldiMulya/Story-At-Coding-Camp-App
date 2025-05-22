// Import komponen kamera dari direktori components
import CameraComponent from '../../components/camera';
import api from '../../data/api';
import maps from '../../components/maps.js';

// Kelas halaman untuk menambahkan laporan
export default class AddStoryPage {
  constructor() {
    this.camera = null; // Untuk menyimpan instance dari kamera
  }

  // Fungsi render akan menampilkan form tambah laporan
  async render() {
    return `
      <section class="add-story container">
        <h2>Tambah Laporan</h2>
        <form id="story-form" enctype="multipart/form-data">

          <!-- Input Judul & deskripsi -->
          <div>
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <!-- Input foto via kamera -->
          <div class="photo-capture-container">
            <label>Foto:</label>

            <div class="camera-container">
              <select id="camera-select"></select> <!-- Pilihan kamera -->
              <video id="camera-preview" autoplay playsinline style="display: none; width: 100%; max-width: 500px;"></video> <!-- Preview kamera -->
              <canvas id="photo-canvas" style="display: none;"></canvas> <!-- Canvas untuk ambil gambar -->
              
              <!-- Kontrol kamera -->
              <div class="camera-controls">
              <button type="button" id="open-camera-btn">Buka Kamera</button>
              <button type="button" id="capture-photo-btn" style="display: none;">Ambil Gambar</button>
              <button type="button" id="retake-photo-btn" style="display: none;">Ambil Ulang</button>
              </div>
              <img id="captured-photo" style="display: block;" /> <!-- Menampilkan gambar hasil capture -->
            </div>

            <!-- Input file fallback -->
            <input type="file" id="photo" name="photo" accept="image/*" style="display: none;" />
            <!-- Menyimpan data gambar dalam format base64 -->
            <input type="hidden" id="photo-data" name="photo-data" />
          </div>


          <!-- Input lokasi With Map-->
          <section class="map-section">
            <div class="maps-container" id="map" >
              ${maps()}
            </div>
          </section>
          
          <!-- Input koordinat -->
          <div>
            <label for="lat">Latitude:</label>
            <input type="number" step="any" id="lat" name="lat" disabled />
          </div>
          <div>
            <label for="lon">Longitude:</label>
            <input type="number" step="any" id="lon" name="lon" disabled />
          </div>

          <!-- Tombol submit -->
          <button type="submit">Kirim Laporan</button>
        </form>
      </section>
    `;
  }

  // Fungsi untuk mengatur logika setelah halaman dirender
  async afterRender() {
    // Ambil elemen DOM
    const openCameraBtn = document.getElementById('open-camera-btn');
    const captureBtn = document.getElementById('capture-photo-btn');
    const retakeBtn = document.getElementById('retake-photo-btn');
    const photoInput = document.getElementById('photo');
    const photoDataInput = document.getElementById('photo-data');
    const form = document.getElementById('story-form');
    const mapElement = document.getElementById('map');

    // Buat instance kamera dan definisikan callback jika foto diambil
    this.camera = new CameraComponent({
      onPhotoCaptured: (dataURL) => {
        photoDataInput.value = dataURL; // Simpan data base64 ke input tersembunyi
      },
    });

    // Inisialisasi kamera (populate camera select)
    await this.camera.init();

    // Tombol buka/tutup kamera
    openCameraBtn.addEventListener('click', async () => {
      if (this.camera.stream) {
        // Jika kamera aktif, maka matikan
        this.camera.stopCamera();
        openCameraBtn.textContent = 'Buka Kamera';
        captureBtn.style.display = 'none';
        if (this.camera.photoTaken) retakeBtn.style.display = 'inline-block';
      } else {
        // Jika kamera belum aktif, maka nyalakan
        await this.camera.startCamera();
        openCameraBtn.textContent = 'Tutup Kamera';
        captureBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
      }
    });

    // Tombol ambil foto
    captureBtn.addEventListener('click', () => {
      this.camera.capturePhoto(); // Ambil gambar
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      openCameraBtn.textContent = 'Buka Kamera';
    });

    // Tombol ambil ulang foto
    retakeBtn.addEventListener('click', () => {
      document.getElementById('captured-photo').style.display = 'none';
      photoDataInput.value = ''; // Hapus foto sebelumnya
      openCameraBtn.click(); // Buka kamera lagi
    });

    // Inisialisasi peta jika elemen peta ada
    if (mapElement) {
      const defaultLat = -6.200000;
      const defaultLon = 106.816666;
      const map = L.map('map').setView([defaultLat, defaultLon], 13);

      // Tambahkan tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Marker kosong yang akan diubah posisi saat klik
      const marker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(map)
        .bindPopup('Klik pada peta untuk pilih lokasi.')
        .openPopup();

      // Isi input awal
      document.getElementById('lat').value = defaultLat;
      document.getElementById('lon').value = defaultLon;

      // Event klik pada peta
      map.on('click', async function (e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);

        document.getElementById('lat').value = lat.toFixed(6);
        document.getElementById('lon').value = lng.toFixed(6);

        // 🔄 Fetch reverse geocode dari OpenStreetMap
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await response.json();
          const locationName = data.display_name || 'Lokasi belum terjamah Manusia';

          marker.bindPopup(locationName).openPopup(); // Perbarui popup marker
        } catch (error) {
          console.error('Gagal mendapatkan nama lokasi:', error);
          marker.bindPopup('Gagal mengambil nama lokasi').openPopup();
        }

        // Isi input koordinat
        document.getElementById('lat').value = lat.toFixed(6);
        document.getElementById('lon').value = lng.toFixed(6);
      });

      // Event drag marker (jika ingin user bisa geser marker)
      marker.on('dragend', function (e) {
        const { lat, lng } = marker.getLatLng();
        document.getElementById('lat').value = lat.toFixed(6);
        document.getElementById('lon').value = lng.toFixed(6);
      });
    }



    // Submit form
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!photoDataInput.value && !photoInput.files.length) {
        alert('Silakan ambil atau unggah foto.');
        return;
      }

      if (photoDataInput.value) {
        const blob = await fetch(photoDataInput.value).then(r => r.blob());
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
      }

      const formDataRaw = new FormData(form);
      formDataRaw.delete('photo-data');

      try {
        const description = formDataRaw.get('description');
        const photo = formDataRaw.get('photo');
        const lat = formDataRaw.get('lat') || undefined;
        const lon = formDataRaw.get('lon') || undefined;

        await api.addStory({ description, photo, lat, lon });

        alert('Laporan berhasil dikirim!');
        form.reset(); // Reset form
        document.getElementById('captured-photo').style.display = 'none';
      } catch (error) {
        alert('Gagal mengirim laporan: ' + error.message);
      }
    });
  }
}
