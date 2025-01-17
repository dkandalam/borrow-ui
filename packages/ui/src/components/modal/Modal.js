import React, { Fragment, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { UI_PREFIX } from '../../config';
import { propTypesChildren } from '../../utils/types';
import { KEY_CODES } from '../../utils/constants';
import { IconControl } from '../icon/IconControl';
import { Loader } from '../loader/Loader';

const MODAL_WRAPPER_CLASS = `${UI_PREFIX}__modal__wrapper`;
const MODAL_CONTAINER_CLASS = `${UI_PREFIX}__modal__container`;
const MODAL_CONTAINER_MAXIMIZED_CLASS = `${UI_PREFIX}__modal__container--maximized`;
const MODAL_CONTAINER_DEFAULT_CLASS = `${UI_PREFIX}__modal__container--default`;
const MODAL_HEADER_CLASS = `${UI_PREFIX}__modal__header`;
const MODAL_CONTROLS_CLASS = `${UI_PREFIX}__modal__controls`;
const MODAL_CONTENT_CLASS = `${UI_PREFIX}__modal__content`;
const MODAL_CONTENT_HEADER_CLASS = `${UI_PREFIX}__modal__content--header`;
const MODAL_CONTENT_HEADER_FOOTER_CLASS = `${UI_PREFIX}__modal__content--header--footer`;
const MODAL_TITLE_CLASS = `${UI_PREFIX}__modal__title`;
const MODAL_FOOTER_CLASS = `${UI_PREFIX}__modal__footer`;

const MODAL_ROOT_ID = 'modal-root';

// these should match the CSS ones, are used to auto-calculate the
// modal height with and withouth footer.
const HEADER_HEIGHT = 55;
const FOOTER_HEIGHT = 65;

// Note: Icon wrappers are defined after ModalWindow

export function Modal({ Trigger, getModalWindowProps }) {
    const [viewModalWindow, setVisible] = useState(false);

    return (
        <Fragment>
            <Trigger setVisible={setVisible} />
            {viewModalWindow && (
                <ModalWindow {...getModalWindowProps({ setVisible })} setVisible={setVisible} />
            )}
        </Fragment>
    );
}

Modal.propTypes = {
    /** Trigger component, will receive a `setVisible` function,
     * which arg is a boolean to set the modal status */
    Trigger: propTypesChildren.isRequired,
    /** Function called to get the Modal props, it should return an object.
     * See `ModalWindow` props to see the valid keys for the return object. */
    getModalWindowProps: PropTypes.func.isRequired,
};

export function ModalWindow({
    title,
    content,
    footer,
    maximized = false,
    closeModal,
    setVisible,
    startWidth = '70%',
    startHeight = 400,
    hooks = {},
    showCloseIcon = true,
    canMaximize = true,
    closeOnEscape = true,
    stopClickPropagation = true,
    wrapperProps = {},
    containerProps = {},
    contentProps = {},
    footerProps = {},
}) {
    const sizedModalContainerStyle = {};
    if (!maximized) {
        sizedModalContainerStyle.width = startWidth;
        sizedModalContainerStyle.height = startHeight;
    }

    const [modalContainer] = useState(
        typeof document !== undefined ? document.createElement('div') : null
    );
    const [modalState, setModalState] = useState({
        isMaximized: maximized,
        modalContainerStyle: maximized ? {} : sizedModalContainerStyle,
        isLoading: hooks.onOpen ? true : false,
    });

    const setIsMaximized = (isMax) => {
        setModalState({
            ...modalState,
            isMaximized: isMax,
            modalContainerStyle: isMax ? {} : sizedModalContainerStyle,
        });
    };

    const closeModalWindow = closeModal ? closeModal : () => setVisible(false);

    useEffect(() => {
        const modalRoot = getModalRoot();
        modalRoot.appendChild(modalContainer);

        const bodyOverflow = typeof document !== undefined && document.body.style.overflow;

        const openPromise = new Promise((resolve, reject) => {
            if (hooks.onOpen) return hooks.onOpen({ resolve, reject });
            else resolve();
        });
        openPromise.then(() => {
            setModalState({ ...modalState, isLoading: false });
            if (typeof document !== undefined) document.body.style.overflow = 'hidden';
        });

        let closeOnEscapeCallback = null;
        if (closeOnEscape) {
            closeOnEscapeCallback = (e) => {
                if (e.keyCode === KEY_CODES.ESCAPE) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModalWindow();
                }
            };

            if (typeof window !== 'undefined') {
                window.addEventListener('keydown', closeOnEscapeCallback);
            }
        }

        return function cleanup() {
            modalRoot.removeChild(modalContainer);
            if (typeof document === undefined || typeof window === undefined) return;

            closeOnEscape && window.removeEventListener('keydown', closeOnEscapeCallback);
            document.body.style.overflow = bodyOverflow;
        };
    }, []); // eslint-disable-line

    const modalContainerStatusClass = modalState.isMaximized
        ? MODAL_CONTAINER_MAXIMIZED_CLASS
        : MODAL_CONTAINER_DEFAULT_CLASS;

    const modalContentSizeClass = footer
        ? MODAL_CONTENT_HEADER_FOOTER_CLASS
        : MODAL_CONTENT_HEADER_CLASS;

    const modalContentStyle = {};
    if (startHeight && !modalState.isMaximized) {
        const startHeightNumber =
            typeof startHeight === 'string' ? +startHeight.replace('px', '') : startHeight;
        const footerHeight = footer ? FOOTER_HEIGHT : 0;
        modalContentStyle.height = `${startHeightNumber - HEADER_HEIGHT - footerHeight}px`;
    }

    return (
        <ModalWindowPortal
            title={title}
            content={content}
            footer={footer}
            classes={{ modalContainerStatusClass, modalContentSizeClass }}
            styles={{ modalContentStyle }}
            showCloseIcon={showCloseIcon}
            canMaximize={canMaximize}
            setIsMaximized={setIsMaximized}
            closeModalWindow={closeModalWindow}
            stopClickPropagation={stopClickPropagation}
            modalState={modalState}
            modalContainer={modalContainer}
            wrapperProps={wrapperProps}
            containerProps={containerProps}
            contentProps={contentProps}
            footerProps={footerProps}
        />
    );
}

ModalWindow.propTypes = {
    /** Modal Title */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /* Modal Content, rendered as modal body */
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /** Modal Footer, rendered after the body */
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**  */
    closeModal: PropTypes.func,
    /** setVisible callback, coming from Modal's Trigger */
    setVisible: PropTypes.func,
    /** Render a close Icon on the top right to close the modal */
    showCloseIcon: PropTypes.bool,
    /** Set the modal maximized on open */
    maximized: PropTypes.bool,
    /** If the modal can maximize to full screen, show icons to trigger the status */
    canMaximize: PropTypes.bool,
    /** Close the modal if Escape key is pressed */
    closeOnEscape: PropTypes.bool,
    /** Stop click event to be propagated outside the modal window */
    stopClickPropagation: PropTypes.bool,
    /** Initial modal height */
    startHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Initial modal width */
    startWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Hooks called on modal events. Valid events are: `onOpen` */
    hooks: PropTypes.shape({
        onOpen: PropTypes.func,
    }),
    /** Props to be passed to modal's top element */
    wrapperProps: PropTypes.object,
    /** Props to be passed to modal's container, inside wrapper element */
    containerProps: PropTypes.object,
    /** Props to be passed to modal's content, inside wrapper element */
    contentProps: PropTypes.object,
    /** Props to be passed to modal's footer, inside wrapper element */
    footerProps: PropTypes.object,
};

function ModalWindowPortal({
    title,
    content,
    footer,
    classes,
    styles,
    showCloseIcon,
    canMaximize,
    setIsMaximized,
    closeModalWindow,
    stopClickPropagation,
    modalState,
    modalContainer,
    wrapperProps,
    containerProps,
    contentProps,
    footerProps,
}) {
    const { modalContainerStatusClass, modalContentSizeClass } = classes;
    const { modalContentStyle } = styles;

    const {
        className: wrapperClass = '',
        onClick: onWrapperClick,
        ...restWrapperProps
    } = wrapperProps;
    const wrapperClassName = `${MODAL_WRAPPER_CLASS} ${wrapperClass}`.trim();

    const {
        className: containerClass = '',
        style: containerStyleProp,
        ...restContainerProps
    } = containerProps;
    const containerClassName =
        `${MODAL_CONTAINER_CLASS} ${modalContainerStatusClass} ${containerClass}`.trim();
    const containerStyle = { ...modalState.modalContainerStyle, ...containerStyleProp };

    const { className: contentClass = '', ...restContentProps } = contentProps;
    const contentClassName =
        `${MODAL_CONTENT_CLASS} ${modalContentSizeClass} ${contentClass}`.trim();

    const { className: footerClass = '', ...restFooterProps } = footerProps;
    const footerClassName = `${MODAL_FOOTER_CLASS} ${footerClass}`.trim();

    const onClick = (e) => {
        // This cannot be tested with react-testing-library,
        // see https://github.com/testing-library/react-testing-library/issues/487
        stopClickPropagation && e.stopPropagation();
        onWrapperClick && onWrapperClick();
    };

    return createPortal(
        <div className={wrapperClassName} onClick={onClick} {...restWrapperProps}>
            <div className={containerClassName} style={containerStyle} {...restContainerProps}>
                <div className={MODAL_HEADER_CLASS}>
                    <div className={MODAL_TITLE_CLASS}>{title}</div>
                    <div className={MODAL_CONTROLS_CLASS}>
                        {!modalState.isLoading && (
                            <Fragment>
                                {!modalState.isMaximized && canMaximize && (
                                    <IconMaximize
                                        setIsMaximized={setIsMaximized}
                                        data-testid="modal-maximize-icon"
                                    />
                                )}
                                {modalState.isMaximized && canMaximize && (
                                    <IconMinimize
                                        setIsMaximized={setIsMaximized}
                                        data-testid="modal-minimize-icon"
                                    />
                                )}
                                {showCloseIcon && (
                                    <IconClose
                                        closeModalWindow={closeModalWindow}
                                        data-testid="modal-close-icon"
                                    />
                                )}
                            </Fragment>
                        )}
                    </div>
                </div>
                <div className={contentClassName} style={modalContentStyle} {...restContentProps}>
                    {modalState.isLoading && <Loader />}
                    {!modalState.isLoading && content}
                </div>
                {footer && (
                    <div className={footerClassName} {...restFooterProps}>
                        {!modalState.isLoading && footer}
                    </div>
                )}
            </div>
        </div>,
        modalContainer
    );
}

function ModalIcon(props) {
    return <IconControl size="small" {...props} />;
}

function IconMaximize({ setIsMaximized, ...rest }) {
    return <ModalIcon name="fullscreen" onClick={() => setIsMaximized(true)} {...rest} />;
}

IconMaximize.propTypes = {
    setIsMaximized: PropTypes.func.isRequired,
};

function IconMinimize({ setIsMaximized, ...rest }) {
    return <ModalIcon name="fullscreen_exit" onClick={() => setIsMaximized(false)} {...rest} />;
}

IconMinimize.propTypes = {
    setIsMaximized: PropTypes.func.isRequired,
};

function IconClose({ closeModalWindow, ...rest }) {
    return (
        <ModalIcon
            name="close"
            onClick={() => closeModalWindow({ source: 'showCloseIcon' })}
            {...rest}
        />
    );
}

IconClose.propTypes = {
    closeModalWindow: PropTypes.func.isRequired,
};

function getModalRoot() {
    if (typeof document === undefined) return;

    let modalRoot = document.getElementById(MODAL_ROOT_ID);
    if (modalRoot === null) {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', MODAL_ROOT_ID);
        document.body.appendChild(modalRoot);
    }
    return modalRoot;
}
