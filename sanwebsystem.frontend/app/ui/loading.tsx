import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = {
    show: (): void => {
        const element = document.querySelector('.loading-container') as HTMLElement;

        if (element !== null && typeof element.offsetWidth === 'number') {
            element.classList.remove('hidden', 'fade-out');
            element.classList.toggle('fade-in');
        }
    },

    hide: (): void => {
        const element = document.querySelector('.loading-container') as HTMLElement;

        if (element !== null) {
            element.addEventListener('transitionend', function handle() {
                this.classList.add('hidden');
                this.classList.remove('fade-in');
                this.classList.toggle('fade-out');

                this.removeEventListener('transitionend', handle);
            });

            element.dispatchEvent(new Event('transitionend'));
        }
    },

    render: (): React.ReactNode => {
        return (
            <div className="loading-container hidden">
                <ProgressSpinner strokeWidth="4" />
            </div>
        );
    }
};

export default Loading;
