import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Icon, Navbar, NavbarLink, SidebarTrigger } from '@borrow-ui/ui';

import logoColor from '../public/logo-color-192.png';
import packageJson from '../package.json';

export function Header({ isSmallScreen }) {
    // Required for Hydration, initial render should be the same as
    // server. "Logic" should be placed in effects.
    const [showLinks, setShowLinks] = useState(false);

    useEffect(() => {
        setShowLinks(!isSmallScreen);
    }, [isSmallScreen]);

    const logo = (
        <Image
            src={logoColor || '/logo-color-192.png'}
            alt="borrow-ui logo"
            width={25}
            height={25}
        />
    );

    return (
        <Navbar
            sticky={false}
            fixed={true}
            className="main-header"
            left={[
                {
                    headerLabel: (
                        <Link href="/">
                            <a className="borrow-ui__navbar__group borrow-ui__navbar__link">
                                <div className="flex-center-center">
                                    {logo}
                                    <span className="header__title">Home</span>
                                </div>
                            </a>
                        </Link>
                    ),
                },
                showLinks && {
                    headerLabel: (
                        <Link href="/blog" prefetch={false}>
                            <a className="borrow-ui__navbar__group borrow-ui__navbar__link">
                                <span>Blog</span>
                            </a>
                        </Link>
                    ),
                },
                showLinks && {
                    headerLabel: (
                        <Link href="/project" prefetch={false}>
                            <a className="borrow-ui__navbar__group borrow-ui__navbar__link">
                                <span>Project</span>
                            </a>
                        </Link>
                    ),
                },
            ].filter((v) => !!v)}
            right={[
                <NavbarLink
                    tag="a"
                    href="https://github.com/borrow-ui/borrow-ui/tree/master/packages/website-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    key="github"
                >
                    <Icon family="fab" name="fa-github" size="small" />
                </NavbarLink>,
                showLinks && (
                    <span className="header__version" key="version">
                        v{packageJson.version}
                    </span>
                ),
                <div key="trigger" className="header__sidebar-trigger">
                    <SidebarTrigger />
                </div>,
            ].filter((v) => !!v)}
        />
    );
}
