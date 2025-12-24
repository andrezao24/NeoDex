import React from "react";
import "./Button.css";

export default function Button({ onClick, children, className = "", disabled = false, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}>
            {children}
        </button>
    );
}
