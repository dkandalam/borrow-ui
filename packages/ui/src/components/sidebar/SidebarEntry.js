import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { UI_PREFIX } from '../../config';
import { a11yClickableElement } from '../../utils/a11y';
import { propTypesChildren } from '../../utils/types';

import { Icon } from '../icon/Icon';
import { Link } from '../link/Link';

import { SidebarContext } from './SidebarContext';
import { SidebarIcon } from './SidebarIcon';
import { SidebarEntryLabelShortcut } from './SidebarEntryLabelShortcut';

export const CONTENT_REQUIRES_ID =
    'SidebarEntry: if you specify `content` prop, you need to set `id` as well.';

const SIDEBAR_ENTRY_CLASS = `${UI_PREFIX}__sidebar__entry`;
const SIDEBAR_ENTRY_ACTIVE_CLASS = `${UI_PREFIX}__sidebar__entry--active`;
const SIDEBAR_ENTRY_GROUP_CLASS = `${UI_PREFIX}__sidebar__entry__group`;
const SIDEBAR_ENTRY_GROUP_CLICKABLE_CLASS = `${UI_PREFIX}__sidebar__entry__group--clickable`;
const SIDEBAR_ENTRY_LABEL_CLASS = `${UI_PREFIX}__sidebar__entry__label`;
const SIDEBAR_ENTRY_LABEL_ACTIVE_CLASS = `${UI_PREFIX}__sidebar__entry__label--active`;

const SIDEBAR_ENTRY_CONTENT_TOGGLE_CLASS = `${UI_PREFIX}__sidebar__entry__toggle`;
const SIDEBAR_ENTRY_CONTENT_CLASS = `${UI_PREFIX}__sidebar__entry__content`;
const SIDEBAR_ENTRY_CONTENT_VISIBLE_CLASS = `${UI_PREFIX}__sidebar__entry__content--visible`;

export function SidebarEntry({
    iconName,
    shortcut,
    id = '',
    onClick,
    children,
    content,
    iconProps,
    tag,
    isActive,
    to,
    href,
    className = '',
    entryClickToggleContent = false,
    ...rest
}) {
    const [sidebarState, setSidebarState] = useContext(SidebarContext);

    if (content && !id) {
        throw new Error(CONTENT_REQUIRES_ID);
    }

    const autoCloseLink = sidebarState && sidebarState.autoCloseLink;
    const isLink = !!(to || href);
    const Tag = tag ? tag : isLink ? Link : 'div';

    const activeClass = isActive ? SIDEBAR_ENTRY_ACTIVE_CLASS : '';
    const entryClass = `${SIDEBAR_ENTRY_CLASS} ${activeClass} ${className}`.trim();
    const clickableClass =
        onClick || (entryClickToggleContent && content) || isLink
            ? SIDEBAR_ENTRY_GROUP_CLICKABLE_CLASS
            : '';
    const entryGroupClass = `${SIDEBAR_ENTRY_GROUP_CLASS} ${clickableClass}`.trim();

    const entryLabelActiveClass = isActive ? SIDEBAR_ENTRY_LABEL_ACTIVE_CLASS : '';
    const entryLabelClass = `${SIDEBAR_ENTRY_LABEL_CLASS} ${entryLabelActiveClass}`;
    const entryContentStatusClass = `${SIDEBAR_ENTRY_CONTENT_CLASS}--${sidebarState.status}`;
    const entryContentVisibleClass =
        id && !!sidebarState.openedEntrySubContent[id] ? SIDEBAR_ENTRY_CONTENT_VISIBLE_CLASS : '';
    const entryContentClass = `${SIDEBAR_ENTRY_CONTENT_CLASS} ${entryContentStatusClass} ${entryContentVisibleClass}`;

    const entryContentToggleOnClick = () => {
        id &&
            content &&
            setSidebarState((state) => {
                const { openedEntrySubContent } = state;
                return {
                    ...state,
                    openedEntrySubContent: {
                        ...openedEntrySubContent,
                        [id]: !Boolean(openedEntrySubContent[id]),
                    },
                };
            });
        entryClickToggleContent && onClick && onClick();
    };

    const clickableEntry =
        onClick || entryClickToggleContent
            ? a11yClickableElement({
                  onClick: content && entryClickToggleContent ? entryContentToggleOnClick : onClick,
                  role: 'navigation',
              })
            : {};
    const contentExpanded = id && !!sidebarState.openedEntrySubContent[id];

    const toggleIcon = contentExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    const clickableToggle =
        content && !entryClickToggleContent
            ? a11yClickableElement({
                  onClick: entryContentToggleOnClick,
                  role: 'navigation',
              })
            : {};

    const otherProps = {
        ...clickableEntry,
        ...rest,
    };
    if (!otherProps.role && isLink) otherProps.role = 'navigation';
    if (isLink && Tag === Link) otherProps.underline = false;

    return (
        <>
            <Tag className={entryClass} to={to} href={href} id={id} {...otherProps}>
                <div
                    className={entryGroupClass}
                    onClick={() =>
                        autoCloseLink &&
                        isLink &&
                        !entryClickToggleContent &&
                        setSidebarState((s) => ({ ...s, opened: false }))
                    }
                >
                    {iconName && (
                        <SidebarIcon
                            name={iconName}
                            isActive={isActive}
                            isOpen={sidebarState.opened}
                            {...iconProps}
                        />
                    )}
                    {!iconName && shortcut !== undefined && (
                        <SidebarEntryLabelShortcut label={shortcut} />
                    )}
                    <div className={entryLabelClass}>{children}</div>
                    {content && (
                        <div className={SIDEBAR_ENTRY_CONTENT_TOGGLE_CLASS}>
                            <Icon name={toggleIcon} size="small" {...clickableToggle} />
                        </div>
                    )}
                </div>
            </Tag>
            {content && (
                <div className={entryContentClass} id={`${id}__content`}>
                    {content}
                </div>
            )}
        </>
    );
}

SidebarEntry.propTypes = {
    /** Name of the icon */
    iconName: PropTypes.string,
    /** Shortcut alternative to the icon */
    shortcut: PropTypes.string,
    /** Link associated with the entry */
    link: PropTypes.string,
    /** Elements visible only when the sidebar is open and expanded */
    content: propTypesChildren,
    /** Entry id, required if `content` is passed */
    id: PropTypes.string,
    /** Additional properties passed to the icon component */
    iconProps: PropTypes.object,
    /** Tag to use for the entry */
    tag: propTypesChildren,
    /** Flag to apply active class */
    isActive: PropTypes.bool,
    /** Flag to determine if clicking the label will toggle the content */
    entryClickToggleContent: PropTypes.bool,
    /** Link target for react-router */
    to: PropTypes.string,
    /** Link target for standard links or Next */
    href: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: propTypesChildren,
};
