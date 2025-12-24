import React from "react";
import './Select.css';

export default function Select({ value, onChange, options, placeholder, className }) {
    return (
        <select
            className={className}
            value={value}
            onChange={onChange}
        >
            <option value=""> {placeholder} </option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
            ))}
        </select>
    );
}
