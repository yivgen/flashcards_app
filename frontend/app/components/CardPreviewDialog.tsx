"use client"

import { faXmark } from "@/node_modules/@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "@/node_modules/@fortawesome/react-fontawesome/index";
import { useEffect, useRef, useState } from "react";
import { Card } from "../types/types";
import CardPreview from "./CardPreview";

type Props = {
    card: Card,
    onClose: () => void,
}

export default function CardPreviewDialog({ card, onClose}: Props) {
    const [showDialog, setShowDialog] = useState(true);

    const handleClose = () => {
        setShowDialog(false);
        onClose();
    }

    const dialogContainerStyle = {
        "display": "grid",
        "justify-items": "center",
        "align-items": "center"
    }

    const dialogStyle = {
        "width": "80%"
    }

    const closeButtonStyle = {
        "position": "fixed",
        "top": "20px",
        "right": "30px",
        "width": "50px",
        "height": "50px"
    }


    const dialog: JSX.Element | null = showDialog ? 
        (
            <div className="fullscreen overlay" style={dialogContainerStyle}>
                <div style={dialogStyle}>
                    <CardPreview card={card} show={true} />
                </div>
                <FontAwesomeIcon 
                    icon={faXmark} 
                    className="btn" 
                    style={closeButtonStyle}
                    onClick={handleClose}
                />
            </div>
        ) : null;

    return dialog;
}