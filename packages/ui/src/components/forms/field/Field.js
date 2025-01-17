import React from 'react';
import PropTypes from 'prop-types';

import { UI_PREFIX } from '../../../config';
import { propTypesChildren } from '../../../utils/types';
import { Label } from '../label/Label';
import { LAYOUTS, ALIGNMENTS, VALIGNMENTS } from '../constants';

const FIELD_CLASS = `${UI_PREFIX}__form__field`;
const FIELD_HORIZONTAL_CLASS = `${UI_PREFIX}__form__field--${LAYOUTS.HORIZONTAL}`;
const FIELD_VERTICAL_CLASS = `${UI_PREFIX}__form__field--${LAYOUTS.VERTICAL}`;
// vAlgnment class is autogenerated:
// const vAlignmentClass = `${UI_PREFIX}__form__field--valignment-${vAlignment}`;
const FIELD_CONTROLLER_CLASS = `${UI_PREFIX}__form__field__controller`;
const FIELD_CONTROLLER_HORIZONTAL_CLASS = `${UI_PREFIX}__form__field__controller--${LAYOUTS.HORIZONTAL}`;
const FIELD_CONTROLLER_VERTICAL_CLASS = `${UI_PREFIX}__form__field__controller--${LAYOUTS.VERTICAL}`;
const FIELD_DESCRIPTION_CONTAINER_CLASS = `${UI_PREFIX}__form__field__description__container`;
const FIELD_DESCRIPTION_CLASS = `${UI_PREFIX}__form__field__description`;

export function Field({
    label,
    children,
    className = '',
    description = '',
    required = false,
    layout = LAYOUTS.DEFAULT,
    htmlFor,
    vAlignment = VALIGNMENTS.DEFAULT,
    labelProps = {},
    labelWidth,
    labelAlignment,
    controllerProps = {},
    descriptionProps = {},
    compact = false,
    ...rest
}) {
    const layoutClass = layout === LAYOUTS.VERTICAL ? FIELD_VERTICAL_CLASS : FIELD_HORIZONTAL_CLASS;
    const vAlignmentClass = `${FIELD_CLASS}--valignment-${vAlignment}`;
    const fieldClass = `${FIELD_CLASS} ${layoutClass} ${vAlignmentClass} ${className}`.trim();

    const fieldControllerLayoutClass =
        layout === LAYOUTS.VERTICAL
            ? FIELD_CONTROLLER_VERTICAL_CLASS
            : FIELD_CONTROLLER_HORIZONTAL_CLASS;
    const { className: controllerClassName = '', ...cProps } = controllerProps;
    const fieldControllerClass = `${FIELD_CONTROLLER_CLASS} ${fieldControllerLayoutClass} ${controllerClassName}`.trim();

    const { className: descriptionClassName = '', ...dProps } = descriptionProps;
    const fieldDescriptionClass = `${FIELD_DESCRIPTION_CLASS} ${descriptionClassName}`.trim();

    const descriptionContent = description && (
        <div className={FIELD_DESCRIPTION_CONTAINER_CLASS}>
            <div className={fieldDescriptionClass} {...dProps}>
                {description}
            </div>
        </div>
    );

    return (
        <div className={fieldClass} {...rest}>
            {label && (
                <Label
                    label={label}
                    width={labelWidth}
                    alignment={labelAlignment}
                    vAlignment={vAlignment}
                    layout={layout}
                    required={required}
                    htmlFor={htmlFor}
                    {...labelProps}
                />
            )}
            {((children && compact) || !compact) && (
                <div className={fieldControllerClass} {...cProps}>
                    {children}
                    {description && layout === LAYOUTS.HORIZONTAL && descriptionContent}
                </div>
            )}
            {description && layout === LAYOUTS.VERTICAL && descriptionContent}
        </div>
    );
}

Field.propTypes = {
    label: propTypesChildren,
    /** Show a description of field value */
    description: propTypesChildren,
    children: propTypesChildren,
    className: PropTypes.string,
    required: PropTypes.bool,
    /** Layout can be `vertical` or `horizontal`. You can change the constants,
     * as well as `DEFAULT`, to create other types of layout.
     */
    layout: PropTypes.oneOf([LAYOUTS.VERTICAL, LAYOUTS.HORIZONTAL]),
    /** ID of input element */
    htmlFor: PropTypes.string,
    /** Label and Field vertical alignment. Default vertical alignment is `'middle'` */
    vAlignment: PropTypes.oneOf([VALIGNMENTS.TOP, VALIGNMENTS.MIDDLE, VALIGNMENTS.BOTTOM]),
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Label alignment (horizontal). Default alignment is `'left'` */
    labelAlignment: PropTypes.oneOf([ALIGNMENTS.LEFT, ALIGNMENTS.CENTER, ALIGNMENTS.RIGHT]),
    /** Additional props passed to label container */
    labelProps: PropTypes.object,
    /** Additional props passed to controller container */
    controllerProps: PropTypes.object,
    /** Additional props passed to description container */
    descriptionProps: PropTypes.object,
    /** Do not render the controller if children is falsy */
    compact: PropTypes.bool,
};

export function VField({ children, ...rest }) {
    return (
        <Field layout={LAYOUTS.VERTICAL} {...rest}>
            {children}
        </Field>
    );
}

VField.propTypes = {
    children: propTypesChildren,
};

export function HField({ children, ...rest }) {
    return (
        <Field layout={LAYOUTS.HORIZONTAL} {...rest}>
            {children}
        </Field>
    );
}

HField.propTypes = {
    children: propTypesChildren,
};
