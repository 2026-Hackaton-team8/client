import { useId } from "react";

type Option = { value: string; label: string; description?: string };

type Props = {
  legend: string;
  required?: boolean;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  radio?: boolean;
};

export function OptionGroup({ legend, required, options, value, onChange, radio }: Props) {
  const name = useId();
  return (
    <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
      <legend className="mb-2 text-label-lg text-black">
        {legend}
        {required && <span className="ml-1 text-primary-500">*</span>}
      </legend>
      <div className="flex gap-2">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-4 py-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-500 ${
                checked
                  ? "border-primary-300 bg-primary-100"
                  : "border-secondary-100 bg-white hover:border-secondary-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className={radio ? "size-4 accent-primary-500" : "sr-only"}
              />
              <span className="flex flex-col">
                <span className={`text-body-md ${checked ? "font-semibold" : ""} text-black`}>
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-label-md font-normal text-secondary-600">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
