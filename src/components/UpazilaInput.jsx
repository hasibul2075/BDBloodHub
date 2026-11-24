import { useState } from "react";
import { getUpazilaOptions, upazilaMatches } from "../utils/bdLocations";
import "../upazila-input.css";

// জেলা অনুযায়ী উপজেলার সাজেশন (ইংরেজি + বাংলা নাম)।
// ঘরে ইংরেজি বা বাংলা যেকোনো ভাষায় লেখা যায়; সিলেক্ট করলে ইংরেজি নামটাই সেভ হয়।
function UpazilaInput({
  id,
  name = "upazila",
  district,
  value,
  onChange,
  placeholder = "",
  required = false,
  wrapperClassName = "",
  icon = null,
}) {
  const [open, setOpen] = useState(false);

  const options = getUpazilaOptions(district).filter((o) =>
    upazilaMatches(o, value)
  );

  const choose = (en) => {
    onChange({ target: { name, value: en } });
    setOpen(false);
  };

  return (
    <div className="upz-wrap">
      <div className={wrapperClassName}>
        {icon}

        <input
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={(e) => {
            onChange(e);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        />
      </div>

      {open && options.length > 0 && (
        <div className="upz-dropdown">
          {options.map((o) => (
            <button
              type="button"
              key={o.en}
              className="upz-option"
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o.en);
              }}
            >
              <span className="upz-en">{o.en}</span>
              <span className="upz-bn">{o.bn}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpazilaInput;
