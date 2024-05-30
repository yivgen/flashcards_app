'use client'

import { faCheck, faPenToSquare, faX, faXmark } from "@/node_modules/@fortawesome/free-solid-svg-icons/index"
import { FontAwesomeIcon } from "@/node_modules/@fortawesome/react-fontawesome/index"
import { useEffect, useRef, useState } from "react"

type Props = {
    value: string,
    maxLength?: number,
    onChange: (newValue:string) => void
}

export default function EditableHeader({value, maxLength, onChange: onApply}: Props) {
    const [newValue, setNewValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEdit = () => {
        setNewValue(value);
        setIsEditing(true);
    }

    useEffect(() => {
        if (inputRef.current && isEditing)
            inputRef.current.focus();
    }, [inputRef, isEditing])

    const handleClose = () => {
        setIsEditing(false);
    }

    const handleApply = () => {
        onApply(newValue);
        handleClose();
    }


    return isEditing ? (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleApply();
        }}>
            <div className="editable-header">
                <h1>
                    <input 
                        type="text" 
                        maxLength={maxLength} 
                        value={newValue} 
                        onChange={e => setNewValue(e.target.value)} 
                        spellCheck='false'
                        ref={inputRef}
                    />
                </h1>
                <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={handleApply}/>
                <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={handleClose}/>
            </div>
        </form>
    ) : (
        <div className="editable-header">
            <h1>{value}</h1>
            <FontAwesomeIcon className="edit-btn btn" icon={faPenToSquare} onClick={handleEdit}/>
        </div>
    )
}