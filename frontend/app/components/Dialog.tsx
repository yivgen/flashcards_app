"use client"

import { useEffect, useRef, useState } from "react";

type Props = {
    prompt: string,
    onClose: () => void,
    onOk: () => void,
}

export default function Dialog({ prompt, onClose, onOk }: Props) {
    const [showDialog, setShowDialog] = useState(true);
    const dialogRef = useRef<null | HTMLDialogElement>(null);

    useEffect(() => {
        if (showDialog) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showDialog])

    const handleClose = () => {
        setShowDialog(false);
        onClose();
    }

    const handleOk = () => {
        handleClose();
        onOk();
    }


    const dialog: JSX.Element | null = showDialog ? 
        (   
            <dialog className="dialog-container" ref={dialogRef} onClose={handleClose}>
                <div className="dialog">
                    <div className="dialog-title">
                        <h2>{prompt}</h2>
                    </div>
                    <div className="dialog-btns">
                        <button className="cancel-btn" onClick={handleClose}>No</button>
                        <button className="confirm-btn" onClick={handleOk}>Yes</button>
                    </div>
                </div>
            </dialog>
        ) : null;

    return dialog;
}