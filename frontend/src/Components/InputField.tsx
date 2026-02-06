import { useState } from "react"; 
import Select from "react-select";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";

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
  requiredfiled?: boolean;
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
  requiredfiled,
  disabled = false,
  options = [],
  values = {},
  showLockIcon = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isDropdown = type === "select";
  const isPasswordField = type === "password";

  const value = values[name] || "";

  return (
    <div className="w-full flex flex-col space-y-1 mt-[8px]">
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="text-input_label text-[11px] md:text-[15px] 3xl:text-[28px] text-gray-900 dark:text-gray-100"
        >
          {label} {requiredfiled && <span className="text-star_mark_color">*</span>}
        </label>
      </div>

      <div
        className={`relative border rounded-md transition-colors flex items-center ${
          disabled
            ? "border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus-within:border-[#00C6D7] focus-within:ring-2 focus-within:ring-[#00C6D7]/20"
        }`}
      >
        {isDropdown ? (
          <Select
            name={name}
            options={options}
            isDisabled={disabled}
            value={options.find((opt) => opt.value === value) || null}
            onChange={(selected) =>
              handleChange({ target: { name, value: String(selected?.value || "") } })
            }
            placeholder={placeholder || "Select"}
            classNames={{
              control: () =>
                `h-[52px] text-[14px] 3xl:text-[30px] bg-transparent border-none dark:text-gray-100`,
              menu: () => "bg-white dark:bg-gray-800",
              menuList: () => "bg-white dark:bg-gray-800",
              singleValue: () => "text-gray-900 dark:text-gray-100",
            }}
            styles={{
              menu: (provided) => ({ ...provided, maxHeight: "unset", overflowY: "unset" }),
              menuList: (provided) => ({ ...provided, maxHeight: 150, overflowY: "auto" }),
              control: (provided) => ({
                ...provided,
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
              }),
            }}
          />
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
    </div>
  );
}

export default InputField;
