import { useState } from "react"; 
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  value: string | number;
  label: string;
}

interface InputFieldProps {
  label: string;
  name: string;
  type: 'text' | 'password' | 'textarea' | 'select' | 'email' | 'number' | 'tel' | 'url';
  placeholder?: string;
  handleChange: (event: { target: { name: string; value: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  options?: Option[];
  values?: Record<string, string>;
  showLockIcon?: boolean;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

function InputField({
  label,
  name,
  type,
  placeholder,
  handleChange,
  required,
  disabled = false,
  options = [],
  values = {},
  showLockIcon = false,
  errors,
  touched,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isDropdown = type === "select";
  const isPasswordField = type === "password";

  const value = values[name] || "";
  const errorMessage =
    touched?.[name] && errors?.[name] ? errors[name] : "";

  return (
    <div className="w-full flex flex-col space-y-1 mt-[8px]">
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="text-input_label text-[11px] md:text-[15px] 3xl:text-[28px] text-gray-900 dark:text-gray-100"
        >
          {label} {required && <span className="text-star_mark_color">*</span>}
        </label>
      </div>

      <div
        className={`relative border rounded-md transition-colors flex items-center ${
          disabled
            ? "border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : errorMessage
              ? "border-red-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200"
              : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus-within:border-[#00C6D7] focus-within:ring-2 focus-within:ring-[#00C6D7]/20"
        }`}
      >
        {isDropdown ? (
          <>
            <select
              name={name}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              className={`w-full h-[43px] 3xl:h-[52px] p-2 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent appearance-none pr-8`}
            >
              <option value="">{placeholder || "Select an option"}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={12} />
          </>
        ) : (
          <>
            {showLockIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <MdLockOutline size={16} />
              </span>
            )}

            {type === "textarea" ? (
              <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full h-[80px] p-2 outline-none ${
                  showLockIcon ? "pl-10" : ""
                } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent`}
              />
            ) : (
              <input
                type={isPasswordField ? (showPassword ? "text" : "password") : type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full h-[43px] 3xl:h-[52px] p-2 outline-none ${
                  showLockIcon ? "pl-10" : ""
                } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent`}
              />
            )}

            {isPasswordField && !disabled && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300 text-[16px]"
              >
                {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
              </span>
            )}
          </>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default InputField;
