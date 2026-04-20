import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
                ©2026 Varga Szabolcs Lajos, All rights reserved!
            </div>
        </div>
    );
}
