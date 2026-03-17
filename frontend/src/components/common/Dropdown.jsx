import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select Option",
    label, // key to display in options object if options are objects
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        onChange(label ? option[label] : option); // Return the value based on label key or option itself
        setIsOpen(false);
    };

    // Helper to get display text
    const getDisplayText = () => {
        if (!value) return placeholder;
        // If value is a simple string and matches an option
        if (typeof value === "string") return value;
        // If complex logic is needed, handled by parent usually passing the selected value string
        return value;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm hover:border-blue-300 transition-all duration-200 flex items-center justify-between ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
                    }`}
            >
                <span className={`block truncate ${!value ? "text-gray-400" : ""}`}>
                    {getDisplayText()}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180 text-blue-500" : ""
                            }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-100 py-2 max-h-60 overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-100 origin-top">
                    {options.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 italic text-center">
                            No options available
                        </div>
                    ) : (
                        options.map((option, index) => {
                            const displayValue = label ? option[label] : option;
                            const isSelected = value === displayValue;

                            return (
                                <div
                                    key={index}
                                    className={`cursor-pointer select-none relative py-3 pl-4 pr-9 text-sm transition-colors duration-150 ${isSelected
                                            ? "text-blue-600 bg-blue-50 font-medium"
                                            : "text-gray-900 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <span
                                        className={`block truncate ${isSelected ? "font-semibold" : "font-normal"
                                            }`}
                                    >
                                        {displayValue}
                                    </span>
                                    {isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
