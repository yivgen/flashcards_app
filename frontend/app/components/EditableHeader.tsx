'use client'

import { faCheck, faPenToSquare, faX, faXmark } from "@/node_modules/@fortawesome/free-solid-svg-icons/index"
import { FontAwesomeIcon } from "@/node_modules/@fortawesome/react-fontawesome/index"
import { useState } from "react"

type Props = {
    value: string,
    onChange: (newValue:string) => void
}

export default function EditableHeader({value, onChange: onApply}: Props) {
    const [newValue, setNewValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setNewValue(value);
        setIsEditing(true);
    }

    const handleClose = () => {
        setIsEditing(false);
    }

    const handleApply = () => {
        onApply(newValue);
        handleClose();
    }


    return isEditing ? (
        <div className="editable-header">
            <h1><input type="text" value={newValue} onChange={e => setNewValue(e.target.value)}/></h1>
            <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={handleApply}/>
            <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={handleClose}/>
        </div>
    ) : (
        <div className="editable-header">
            <h1>{value}</h1>
            <FontAwesomeIcon className="edit-btn btn" icon={faPenToSquare} onClick={handleEdit}/>
        </div>
    )
}