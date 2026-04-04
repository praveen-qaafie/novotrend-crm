export const InputField = ({
  type,
  placeholder,
  onChange,
  name,
  value,
  iName,
  setShowPassword,
  showPassword,
  required,
  size,
  ...rest
}) => {
  return (
    <div className="flex relative items-center">
      <i
        className={`bi bi-${iName} absolute left-2 text-gray-400 font-extrabold`}
      ></i>
      <input
        className={`w-${size} px-7 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent    placeholder:text-base font-medium`}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        value={value}
        {...rest}
      />
      {rest.props === "password" || type === "password" ? (
        <i
          className={`bi bi-${
            showPassword ? "eye" : "eye-slash-fill"
          } absolute right-0 text-gray-400 font-extrabold p-2 cursor-pointer`}
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};
