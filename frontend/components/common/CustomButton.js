import React from "react";

const CustomButton = ({
  buttonType = "button",
  text = "Pass button text as prop",
  disabled,
  onClick = null,
}) => {
  return (
    <div>
      <button
        className="p-1 px-5 mr-3 h-8 bg-blue-500 text-white rounded-md outline-none disabled:opacity-25"
        type={buttonType}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default CustomButton;
