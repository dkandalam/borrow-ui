import React, { useState, Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { UI_PREFIX } from '../../config';
import { propTypesChildren } from '../../utils/types';

import { IconControl } from '../icon/IconControl';
import { Loader } from '../loader/Loader';

const PANEL_CLASS = `${UI_PREFIX}__panel`;
const PANEL_VISIBLE_CLASS = `${UI_PREFIX}__panel--visible`;
const PANEL_WRAPPER_CLASS = `${UI_PREFIX}__panel__wrapper`;
const PANEL_WRAPPER_VISIBLE_CLASS = `${UI_PREFIX}__panel__wrapper--visible`;
const PANEL_CONTAINER_CLASS = `${UI_PREFIX}__panel__container`;
const PANEL_HEADER_CLASS = `${UI_PREFIX}__panel__header`;
const PANEL_HEADER_TITLE_CLASS = `${UI_PREFIX}__panel__header__title`;
const PANEL_HEADER_CONTROLS_CLASS = `${UI_PREFIX}__panel__header__controls`;
const PANEL_CONTENT_CLASS = `${UI_PREFIX}__panel__content`;
const PANEL_FOOTER_CLASS = `${UI_PREFIX}__panel__footer`;

const ICON_CLOSE = 'close';

const PANEL_ROOT_ID = `${UI_PREFIX}-panel-root`;
const PANEL_WRAPPER_ID = `${UI_PREFIX}-panel-wrapper`;

export const DEFAULT_PANEL_WIDTH = 500;

let lastSetVisible = null;

export function Panel({ Trigger, getPanelContentProps }) {
    const [visible, setVisible] = useState(false);
    getPanelRoot(); // use here to prepare the panel

    const uniqueSetVisible = (state) => {
        if (state) {
            if (lastSetVisible) lastSetVisible(false);
            lastSetVisible = null;
        }
        setVisible(state);
    };

    return (
        <Fragment>
            <Trigger setVisible={uniqueSetVisible} visible={visible} />
            {visible && (
                <PanelContent
                    {...getPanelContentProps({ setVisible })}
                    visible={visible}
                    setVisible={setVisible}
                />
            )}
        </Fragment>
    );
}

Panel.propTypes = {
    Trigger: propTypesChildren.isRequired,
    getPanelContentProps: PropTypes.func.isRequired,
};

export function PanelContent({
    content,
    title,
    controls,
    footer,
    visible,
    hooks = {},
    setVisible,
    width = DEFAULT_PANEL_WIDTH,
    innerContainerWidth,
    showWrapper = true,
    containerProps = {},
    contentProps = {},
    footerProps = {},
}) {
    const [panelState, setPanelState] = useState({
        isLoading: hooks.onOpen ? true : false,
    });
    const panelRoot = getPanelRoot();
    const panelWrapper = getPanelWrapper();

    lastSetVisible = setVisible;
    const pageWidth = typeof document !== 'undefined' ? document.body.clientWidth : width;
    const styleWidth = typeof width === 'number' ? `${Math.min(width, pageWidth)}px` : width;
    const innerContainerStyleWidth = innerContainerWidth || styleWidth;

    useEffect(() => {
        const openPromise = new Promise((resolve, reject) => {
            if (hooks.onOpen) return hooks.onOpen({ resolve, reject });
            else resolve();
        });
        openPromise.then(() => {
            setPanelState({ ...panelState, isLoading: false });
        });

        const closePanel = () => setVisible(false);

        panelWrapper.addEventListener('click', closePanel);

        return function cleanup() {
            lastSetVisible = null;
            panelRoot.classList.remove(PANEL_VISIBLE_CLASS);
            panelRoot.style.width = 0;
            showWrapper && panelWrapper.classList.remove(PANEL_WRAPPER_VISIBLE_CLASS);
            panelWrapper.removeEventListener('click', closePanel);
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (visible) {
            panelRoot.classList.add(PANEL_VISIBLE_CLASS);
            panelRoot.style.width = styleWidth;
            showWrapper && panelWrapper.classList.add(PANEL_WRAPPER_VISIBLE_CLASS);
        }
    }, [visible, panelRoot, panelWrapper, styleWidth, showWrapper]);

    const {
        className: containerClass,
        style: containerStyle,
        ...restContainerProps
    } = containerProps;
    const containerClassName = `${PANEL_CONTAINER_CLASS} ${containerClass}`.trim();

    const { className: contentClass = '', ...restContentProps } = contentProps;
    const contentClassName = `${PANEL_CONTENT_CLASS} ${contentClass}`.trim();

    const { className: footerClass = '', ...restFooterProps } = footerProps;
    const footerClassName = `${PANEL_FOOTER_CLASS} ${footerClass}`.trim();

    return createPortal(
        <div
            className={containerClassName}
            style={{ width: innerContainerStyleWidth }}
            {...restContainerProps}
        >
            <div className={PANEL_HEADER_CLASS}>
                <div className={PANEL_HEADER_TITLE_CLASS}>{title}</div>
                <div className={PANEL_HEADER_CONTROLS_CLASS}>
                    {controls}
                    <IconControl
                        name={ICON_CLOSE}
                        onClick={() => setVisible(false)}
                        data-testid="panel-close-icon"
                    />
                </div>
            </div>
            <div className={contentClassName} {...restContentProps}>
                {panelState.isLoading && <Loader />}
                {!panelState.isLoading && content}
            </div>
            {footer && (
                <div className={footerClassName} {...restFooterProps}>
                    {footer}
                </div>
            )}
        </div>,
        panelRoot
    );
}

// NOTE: remember to change props also in PanelStory, used to
//       generate ArgsTable values in Storybook.
PanelContent.propTypes = {
    /** Main content to be shown in the panel */
    content: propTypesChildren,
    /** Title of the panel */
    title: propTypesChildren,
    /** Items to be shown in the header (like in `PageHeader` component) */
    controls: propTypesChildren,
    /** Footer of the panel. A `flex` display is used with `space-between`,
     * so if you need to add elements only on the right you need to pass also
     * an empty item for the left. */
    footer: propTypesChildren,
    /** Set the panel visible */
    visible: PropTypes.bool,
    /** hooks called when the panel:
     * - opens: `onOpen`, this must be a promise.
     */
    hooks: PropTypes.object,
    /** Width of the panel. */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Width of the content. If you specify `width` as percentage, you need to specify  */
    innerContainerWidth: PropTypes.number,
    /** setVisible callback, passed by `Panel` component */
    setVisible: PropTypes.func.isRequired,
    /** Props to be passed to modal's container, inside wrapper element */
    containerProps: PropTypes.object,
    /** Props to be passed to modal's content, inside wrapper element */
    contentProps: PropTypes.object,
    /** Props to be passed to modal's footer, inside wrapper element */
    footerProps: PropTypes.object,
};

function getPanelRoot() {
    if (typeof document === 'undefined') return;

    let panelRoot = document.getElementById(PANEL_ROOT_ID);
    if (panelRoot === null) {
        panelRoot = document.createElement('div');
        panelRoot.setAttribute('id', PANEL_ROOT_ID);
        panelRoot.classList.add(PANEL_CLASS);
        panelRoot.style.width = 0;
        document.body.appendChild(panelRoot);
    }
    return panelRoot;
}
function getPanelWrapper() {
    if (typeof document === 'undefined') return;

    let panelWrapper = document.getElementById(PANEL_WRAPPER_ID);
    if (panelWrapper === null) {
        panelWrapper = document.createElement('div');
        panelWrapper.setAttribute('id', PANEL_WRAPPER_ID);
        panelWrapper.setAttribute('data-testid', 'panel-wrapper');
        panelWrapper.classList.add(PANEL_WRAPPER_CLASS);
        document.body.appendChild(panelWrapper);
    }
    return panelWrapper;
}
