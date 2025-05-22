export default function ReportCard({ location, date, time, image, description, id }) {
  const cardColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`;

  return `
    <div class="report-card" style="background-color: ${cardColor};">
      <div class="report-header">
        <span class="report-location">📍 ${location}</span>
        <span class="report-datetime">${date} | ${time}</span>
      </div>

      <div class="report-image">
        ${image
      ? `<img src="${image}" alt="Report Image"/>`
      : `<div class="image-placeholder">Image taken by Camera User</div>`}
      </div>

      <div class="report-content">
        <p class="report-description">${description}</p>
        <div class="report-actions">
          <a href="#/stories/${id}" class="report-link">
            Selengkapnya
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <button class="delete-button">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
