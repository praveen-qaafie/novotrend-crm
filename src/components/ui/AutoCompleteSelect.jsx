import { useState, useRef, useEffect } from "react";

/**
 * AutocompleteSelect
 * Props:
 * - options: array of objects to select from
 * - placeholder: input placeholder
 * - value: selected value (string)
 * - onChange: function({ target: { name, value } })
 * - name: input name
 * - className: additional classes
 * - disabled: disable input
 * - getOptionLabel: function(option) => string (optional, defaults to groupname/accno)
 */
const AutocompleteSelect = ({
  options = [],
  placeholder = "Select an option",
  value = "",
  onChange = () => {},
  name = "",
  className = "",
  disabled = false,
  getOptionLabel,
}) => {
  // Robust label getter
  const getLabel = (option) => {
    if (!option) return "";
    if (typeof getOptionLabel === "function") return getOptionLabel(option);
    if (typeof option.groupname === "string") return option.groupname;
    if (typeof option.accno === "string") return option.accno;
    return "";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = (options || []).filter((option) => {
        const label = getLabel(option);
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
      setHighlightedIndex(-1);
    } else {
      setFilteredOptions(options || []);
    }
  }, [searchTerm, options]);

  // Set display value
  useEffect(() => {
    if (value) {
      const selectedOption = (options || []).find(
        (option) => getLabel(option) === value,
      );
      if (selectedOption && !isOpen) {
        setSearchTerm(getLabel(selectedOption));
      }
    } else if (!isOpen) {
      setSearchTerm("");
    }
  }, [value, isOpen, options]);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    // Clear selection if user is typing
    if (term !== value) {
      onChange({ target: { name, value: "" } });
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(getLabel(option));
    setIsOpen(false);
    onChange({ target: { name, value: getLabel(option) } });
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow option clicks to register
    setTimeout(() => {
      setIsOpen(false);
      // Reset to selected value if nothing valid was typed
      if (value) {
        const selectedOption = (options || []).find(
          (option) => getLabel(option) === value,
        );
        if (selectedOption) {
          setSearchTerm(getLabel(selectedOption));
        }
      } else {
        setSearchTerm("");
      }
    }, 150);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (value) {
      setSearchTerm("");
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-transparent border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"
        }`}
        autoComplete="off"
      />
      {/* Dropdown arrow */}
      <div
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul ref={listRef} className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    highlightedIndex === index
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{getLabel(option)}</span>
                    {option && option.leverage && (
                      <span className="text-sm text-gray-500">
                        {option.leverage}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSelect;