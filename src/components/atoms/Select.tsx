import React, { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string | null;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  containerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find((opt) => opt.value === value) || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected option when value prop changes
  useEffect(() => {
    const matchingOption = options.find((opt) => opt.value === value);
    setSelectedOption(matchingOption || null);
  }, [value, options]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const focusableElements = document.querySelectorAll('[role="option"]');
      (focusableElements[0] as HTMLElement)?.focus();
    }
  };

  // Handle keyboard navigation within the dropdown
  const handleOptionKeyDown = (
    e: React.KeyboardEvent,
    option: SelectOption,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(option);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const focusableElements = document.querySelectorAll('[role="option"]');
      const nextIndex = (index + 1) % focusableElements.length;
      (focusableElements[nextIndex] as HTMLElement)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const focusableElements = document.querySelectorAll('[role="option"]');
      const prevIndex =
        (index - 1 + focusableElements.length) % focusableElements.length;
      (focusableElements[prevIndex] as HTMLElement)?.focus();
    }
  };

  return (
    <div
      className={`relative w-fit ${containerClassName ?? ""}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={`
          relative bg-white border border-gray-300 rounded-md
          min-w-140 cursor-pointer hover:border-gray-400
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
          ${className}
        `}
      >
        {/* Selected Option Display */}
        <button
          type="button"
          className="flex items-center justify-between px-2 py-2 w-full text-left"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={
            label ? label.replace(/\s+/g, "-").toLowerCase() : undefined
          }
        >
          <span
            className={`block truncate text-xs ${!selectedOption ? "text-gray-500" : "text-gray-900"}`}
          >
            {selectedOption?.value ? selectedOption.value : placeholder}
          </span>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <ul
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-labelledby={
              label ? label.replace(/\s+/g, "-").toLowerCase() : undefined
            }
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                className={`
                  px-4 py-2 cursor-pointer hover:bg-pink-200 
                  ${selectedOption?.value === option.value ? "bg-[#CD1B78] text-white" : "text-gray-900"}
                `}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option, index)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                tabIndex={0}
              >
                <span className="block truncate text-xs">{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
