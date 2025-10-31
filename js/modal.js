// Modal component for displaying explanations and test plans
export class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.closeModalButton = document.getElementById('closeModal');
        this.markdownConverter = new showdown.Converter({ tables: true });
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeModalButton.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(title) {
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = '<div class="loader"></div>';
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    setContent(markdownContent) {
        this.modalBody.innerHTML = this.markdownConverter.makeHtml(markdownContent);
    }

    setError(error) {
        this.modalBody.innerHTML = `<span class="text-red-400">${error}</span>`;
    }
}