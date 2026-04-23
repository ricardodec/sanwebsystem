'use client';

import React, { useEffect } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    id: string;
    className: string;
    children?: React.ReactNode;
}

const ScrollToTopBtn = ({ id, className, children }: ButtonProps) => {
    useEffect(() => {
        const scrollToTopBtn = document.querySelector(
            '#' + id,
        ) as HTMLButtonElement;

        window.onscroll = () => {
            if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
            ) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        };

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <button
            type="button"
            id={id}
            className={className}
            title="Ir para o topo"
        >
            {children}
        </button>
    );
};

export default ScrollToTopBtn;
