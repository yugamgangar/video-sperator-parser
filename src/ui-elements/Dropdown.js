import React from 'react'
import '../styles/dropdown.scss'
import { getuid } from '../helper'

const Dropdown = ({ value, label = 'Dropdown', classname = '', options = [''], changeHandler, errorMessage, name }) => {
    const id = getuid()
    return (
        <div className="dropdown-wrapper">
            <select value={value} className={`segment-settings-dd${classname}`} name={name} onChange={(e) => changeHandler(e.target.name, e.target.value)} id={id}>
                {options.map((el, idx) => <option key={id + '$' + idx}>{el}</option>)}
            </select>
            <label htmlFor={id}>{label}</label>
            <div className="error-message">{errorMessage}</div>
        </div>
    )
}

export default Dropdown;
