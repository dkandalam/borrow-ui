import React, { Fragment } from 'react';

import { Modal, Button, Lorem } from '@borrow-ui/ui/lib';

export function Modals() {
    return (
        <div className="m-b-20">
            <h1>Modals</h1>
            <Modal
                Trigger={({ setViewModalWindow }) => (
                    <Button onClick={() => setViewModalWindow(true)} className="m-r-10">
                        Open Modal
                    </Button>
                )}
                getModalWindowProps={({ setViewModalWindow }) => {
                    return {
                        title: 'Modal',
                        content: <LoremContent />,
                        footer: (
                            <Fragment>
                                <div>Left element</div>
                                <Button mean="primary" onClick={() => setViewModalWindow(false)}>
                                    Close
                                </Button>
                            </Fragment>
                        ),
                    };
                }}
            />
            <Modal
                Trigger={({ setViewModalWindow }) => (
                    <Button onClick={() => setViewModalWindow(true)} mean="primary">
                        Open Modal
                    </Button>
                )}
                getModalWindowProps={({ setViewModalWindow }) => {
                    return {
                        title: 'Something to work about',
                        content: <LoremContent />,
                        footer: (
                            <Fragment>
                                <div />
                                <div>
                                    <Button
                                        mean="positive"
                                        className="m-r-5"
                                        onClick={() => setViewModalWindow(false)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        mean="negative"
                                        onClick={() => setViewModalWindow(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Fragment>
                        ),
                        hooks: {
                            onOpen: ({ resolve }) => {
                                setTimeout(() => {
                                    resolve();
                                }, 1500);
                            },
                        },
                    };
                }}
            />
        </div>
    );
}

function LoremContent() {
    return (
        <div>
            <Lorem />
        </div>
    );
}
