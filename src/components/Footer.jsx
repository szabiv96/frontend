import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const socialLinks = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/szabolcs.lajos/',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true' className='strokeIcon'>
                <rect x='4' y='4' width='16' height='16' rx='4.5' />
                <circle cx='12' cy='12' r='3.6' />
                <circle cx='17' cy='7' r='0.7' />
            </svg>
        ),
    },
    {
        name: 'Behance',
        href: 'https://www.behance.net/szabolcvarga96',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M4 6h6.3c2.4 0 3.9 1.2 3.9 3.1 0 1.1-.5 2-1.5 2.5 1.3.5 2 1.5 2 3 0 2.2-1.7 3.4-4.3 3.4H4V6zm5.8 4.7c1 0 1.6-.4 1.6-1.2s-.6-1.2-1.6-1.2H6.9v2.4h2.9zm.3 5c1.2 0 1.8-.5 1.8-1.4s-.7-1.4-1.9-1.4H6.9v2.8h3.2z' />
                <path d='M15.8 7h5.1v1.5h-5.1V7zm2.8 3.1c2.5 0 4.1 1.8 4.1 4.4 0 .3 0 .6-.1.8h-5.8c.2 1 1 1.6 2.1 1.6.8 0 1.4-.3 1.9-.9l1.5 1.5c-.8 1-2 1.6-3.5 1.6-2.7 0-4.4-1.8-4.4-4.5s1.7-4.5 4.2-4.5zm1.7 3.6c-.1-1-.7-1.6-1.7-1.6-.9 0-1.6.6-1.8 1.6h3.5z' />
            </svg>
        ),
    },
    {
        name: 'Substack',
        href: 'https://substack.com/@szabolcslajos',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M5 4h14v2.6H5V4zm0 4.6h14v2.6H5V8.6zm0 4.6h14V21l-7-3.9L5 21v-7.8z' />
            </svg>
        ),
    },
];

function getFooterThreshold(pathname) {
    if (pathname === '/') {
        return 0.1;
    }

    if (pathname === '/gallery') {
        return 0.08;
    }

    if (/^\/gallery\/[^/]+$/.test(pathname)) {
        return 0.06;
    }

    if (pathname === '/cv') {
        return 0.06;
    }

    return 0.1;
}

export default function Footer() {
    const { pathname } = useLocation();
    const [showFooter, setShowFooter] = useState(false);
    const thresholdRatio = getFooterThreshold(pathname);

    useEffect(() => {
        const evaluateFooterVisibility = () => {
            if (document.body.classList.contains('gallery-view-open')) {
                setShowFooter(false);
                return;
            }

            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const threshold = pageHeight * thresholdRatio;

            if (pageHeight <= viewportHeight) {
                setShowFooter(true);
                return;
            }

            setShowFooter(pageHeight - scrollPosition < threshold);
        };

        evaluateFooterVisibility();

        window.addEventListener('scroll', evaluateFooterVisibility);
        window.addEventListener('resize', evaluateFooterVisibility);
        window.addEventListener('footer-visibility-change', evaluateFooterVisibility);

        return () => {
            window.removeEventListener('scroll', evaluateFooterVisibility);
            window.removeEventListener('resize', evaluateFooterVisibility);
            window.removeEventListener('footer-visibility-change', evaluateFooterVisibility);
        };
    }, [pathname, thresholdRatio]);

    return (
        <div className={`footer ${showFooter ? 'footerShow' : 'footerHide'}`}>
            <div className='credits'>
                <div className='socialLinks' aria-label='Social links'>
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target='_blank'
                            rel='noreferrer'
                            aria-label={link.name}
                            className='socialLink'
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
                ©2026 Varga Szabolcs Lajos, All rights reserved!
            </div>
        </div>
    );
}
