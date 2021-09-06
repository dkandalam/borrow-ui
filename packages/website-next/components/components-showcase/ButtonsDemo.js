import React from 'react';

import { Title, Button } from '@borrow-ui/ui';

import { ImportStatement } from './ImportStatement';

import styles from './components-styles.module.scss';

export function ButtonsDemo() {
    return (
        <div className={styles['components-showcase__component']}>
            <a name="buttons" className="component-anchor">
                <Title tag="h2" className="color-secondary">
                    Buttons
                </Title>
            </a>
            <ImportStatement
                importStatement="import { Button } from '@borrow-ui/ui';"
                docs="?path=/docs/components-button--default-story"
            />
            <div>
                <div className="flex-start-center flex--wrap m-b-20">
                    <Button onClick={() => window.alert('test')}>Neutral</Button>
                    <Button disabled={true} onClick={() => window.alert('test')}>
                        Disabled
                    </Button>
                    <Button mean="primary" onClick={() => window.alert('primary')}>
                        Primary
                    </Button>
                    <Button
                        mean="primary"
                        disabled={true}
                        onClick={() => window.alert('primary disabled')}
                    >
                        Disabled
                    </Button>
                    <Button mean="secondary" onClick={() => window.alert('secondary')}>
                        Secondary
                    </Button>
                    <Button
                        mean="secondary"
                        disabled={true}
                        onClick={() => window.alert('secondary disabled')}
                    >
                        Disabled
                    </Button>
                    <Button mean="accent" onClick={() => window.alert('accent')}>
                        Accent
                    </Button>
                    <Button
                        mean="accent"
                        disabled={true}
                        onClick={() => window.alert('accent disabled')}
                    >
                        Disabled
                    </Button>
                </div>
                <div className="flex-start-center flex--wrap m-b-20">
                    <Button mean="positive" onClick={() => window.alert('positive clicked')}>
                        Positive
                    </Button>
                    <Button
                        mean="positive"
                        disabled={true}
                        onClick={() => window.alert('positive')}
                    >
                        Disabled
                    </Button>
                    <Button mean="warning" onClick={() => window.alert('warning')}>
                        Warning
                    </Button>
                    <Button
                        mean="warning"
                        disabled={true}
                        onClick={() => window.alert('warning disabled')}
                    >
                        Disabled
                    </Button>
                    <Button mean="negative" onClick={() => window.alert('negative')}>
                        Negative
                    </Button>
                    <Button
                        mean="negative"
                        disabled={true}
                        onClick={() => window.alert('negative disabled')}
                    >
                        Disabled
                    </Button>
                </div>

                <Title tag="h3">Reverse</Title>
                <div className="flex-start-center flex--wrap m-b-20">
                    <Button onClick={() => window.alert('test')} mean="neutral-reverse">
                        Neutral
                    </Button>
                    <Button mean="primary-reverse" onClick={() => window.alert('primary-reverse')}>
                        Primary
                    </Button>
                    <Button
                        mean="secondary-reverse"
                        onClick={() => window.alert('secondary-reverse')}
                    >
                        Secondary
                    </Button>
                    <Button mean="accent-reverse" onClick={() => window.alert('accent-reverse')}>
                        Accent
                    </Button>
                    <Button
                        mean="positive-reverse"
                        onClick={() => window.alert('positive-reverse')}
                    >
                        Positive
                    </Button>
                    <Button mean="warning-reverse" onClick={() => window.alert('warning-reverse')}>
                        Warning
                    </Button>
                    <Button
                        mean="negative-reverse"
                        onClick={() => window.alert('negative-reverse')}
                    >
                        Negative
                    </Button>
                </div>

                <Title tag="h3">Styles</Title>
                <div className="flex-start-center flex--wrap m-b-20">
                    <Button mean="primary" flat={true}>
                        Flat
                    </Button>
                    <Button mean="accent" icon="dashboard">
                        Icon
                    </Button>
                </div>

                <Title tag="h3">Sizes</Title>
                <div className="flex-start-center flex--wrap m-b-20">
                    <Button mean="primary" size="huge">
                        Huge
                    </Button>
                    <Button mean="primary" size="bigger">
                        Bigger
                    </Button>
                    <Button mean="primary" size="big">
                        Big
                    </Button>
                    <Button mean="primary" size="normal">
                        Normal
                    </Button>
                    <Button mean="primary" size="small">
                        Small
                    </Button>
                    <Button mean="primary" size="smaller">
                        Smaller
                    </Button>
                </div>
            </div>
        </div>
    );
}