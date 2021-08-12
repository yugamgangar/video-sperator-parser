import React from 'react'
import '../styles/input.scss'
import { getuid } from '../helper'

const Input = ({ label, type = 'text', inputHandler, classname = '', value, name, inputMode, style = {}, errorMessage = null, labelclass = '' }) => {
    const id = getuid()
    return (
        <div className="input-wrapper" style={style}>
            {value ? (
                <input type={type} className={`custom-input ${classname}`} value={value} id={id} onChange={inputHandler} name={name} inputMode={inputMode} />
            ) : (<input type={type} className={`custom-input ${classname}`} id={id} onChange={inputHandler} name={name} inputMode={inputMode} />
                )}
            <label htmlFor={id} className={labelclass}>{label}</label>
            <div className="error-message">{errorMessage}</div>
        </div>
    )
}

export default Input;
