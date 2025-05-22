import api from '../../data/api.js';
import { getToken } from '../../utils/index';
import Header from '../../components/header';
import ReportCard from '../../components/reportCard';
import AddNewButton from '../../components/AddNewButton';
import maps from '../../components/maps.js';
import HomePresenter from '../../presenter/HomePresenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this, model: api });
  }
  async render() {

    if (!getToken()) {
      window.location.href = '/#/login';
      return '';
    }
    // VIEW
    return `
      <!-- Skip link untuk aksesibilitas -->
      <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

        <section class="home-page">

          <!-- header semantic -->
          <header>
              <section aria-label="Peta lokasi laporan" class="maps-container">  <!-- Peta dengan aria-label untuk aksesibilitas -->
                ${maps()}
              </section>
          </header>

          <!-- Konten utama dengan ID untuk skip link -->
          <main id="main-content">
            <div class="home-container">

              <!-- Header dan tombol tambah laporan -->
              <div class="header-report-wrapper">
                <div>
                    ${Header()}
                </div>
                <div class="add-report-wrapper">
                    ${AddNewButton()}
                </div>
              </div>

              <!-- Daftar laporan dengan semantic element -->
              <section aria-labelledby="report-heading">
                <h2 id="report-heading" class="sr-only">Daftar Cerita</h2>
                <div class="wrapper-card">
                  <div id="report-list" class="report-list" role="list"></div>
                </>
              </section>
            </div>
          </main>
        </section>
    `;
  }
  async afterRender() {
    // ⬇️ Ambil dan tampilkan data laporan dari presenter
    await this.presenter.loadReports();

    // ⬇️ Inisialisasi peta
    this._setupMap();

    // ⬇️ Aktifkan View Transition API
    this._setupViewTransition();
  }

  displayReports(reports) {
    const reportListContainer = document.querySelector('#report-list');
    reportListContainer.innerHTML = '';

    reports.forEach((report) => {
      reportListContainer.innerHTML += ReportCard({
        location: `${report.name}`,
        date: new Date(report.createdAt).toLocaleDateString(),
        time: new Date(report.createdAt).toLocaleTimeString(),
        image: report.photoUrl,
        description: report.description || 'No description available',
      });
    });
  }

  showEmptyMessage() {
    const reportListContainer = document.querySelector('#report-list');
    reportListContainer.innerHTML = '<p class="empty-report">Belum ada laporan tersedia.</p>';
  }

  _setupMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const map = L.map('map').setView([-6.200000, 106.816666], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([-6.2, 106.8])
        .addTo(map)
        .bindPopup('I am Here at "Jakarta"')
        .openPopup();
    }
  }

  _setupViewTransition() {
    if (document.startViewTransition) {
      document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith(window.location.origin)) {
          e.preventDefault();
          document.startViewTransition(() => {
            window.location.href = e.target.href;
          });
        }
      });
    }
  }
}