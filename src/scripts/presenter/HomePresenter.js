// File: scripts/presenters/HomePresenter.js
export default class HomePresenter {
    constructor({ view, model }) {
        this.view = view;
        this.model = model;
    }

    async loadReports() {
        try {
            const reports = await this.model.getStories();
            if (!reports || reports.length === 0) {
                this.view.showEmptyMessage();
            } else {
                this.view.displayReports(reports);
            }
        } catch (error) {
            console.error('Gagal mengambil laporan:', error);
            this.view.showEmptyMessage();
        }
    }
}