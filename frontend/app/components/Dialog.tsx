"use client"

import { useSearchParams, usePathname } from "@/node_modules/next/navigation";
import { useEffect, useRef } from "react";
import { useRouter } from '@/node_modules/next/navigation';

type Props = {
    urlParamName: string,
    title: string,
    onClose: () => void,
    onOk: () => void,
    children: React.ReactNode,
}

export default function Dialog({ urlParamName, title, onClose, onOk, children }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPath = usePathname();
    const dialogRef = useRef<null | HTMLDialogElement>(null);
    const showDialog = searchParams.get(urlParamName)
    useEffect(() => {
        if (showDialog === 'y') {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showDialog])

    const closeDialog = () => {
        dialogRef.current?.close();
        onClose();
        const params = new URLSearchParams(searchParams.toString());
        params.delete(urlParamName);
        router.push(currentPath + params.toString());
    }

    const clickOk = () => {
        onOk();
        closeDialog();
    }

    const dialog: JSX.Element | null = showDialog === 'y' ? 
        (   
            <dialog className="dialog-container" ref={dialogRef}>
                <div className="dialog">
                    <div className="dialog-title">
                        <h1>{title}</h1>
                        <button className="close-dialog-btn" onClick={closeDialog}>X</button>
                    </div>
                    <div className="dialog-content">
                        {children}
                    </div>
                    <div className="dialog-ok">
                        <button onClick={clickOk}>OK</button>
                    </div>
                </div>
            </dialog>
        ) : null;

    return dialog;
}