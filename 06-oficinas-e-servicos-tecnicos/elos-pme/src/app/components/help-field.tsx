"use client";
import {
  cloneElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type HTMLAttributes,
} from "react";
export function HelpField({
  label,
  help,
  context,
  children,
}: {
  label: string;
  help: string;
  context?: string;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="help-field"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="field-heading">
        <label htmlFor={id}>{label}</label>
        <button
          ref={trigger}
          type="button"
          className="help-trigger"
          aria-label={`Ajuda: ${label}${context ? ` (${context})` : ""}`}
          aria-expanded={open}
          aria-controls={`${id}-help`}
          onClick={() => setOpen(!open)}
        >
          ?
        </button>
      </div>
      <div id={`${id}-help`} className="help-note" hidden={!open} role="note">
        {help}
      </div>
      {cloneElement(children, {
        id,
        "aria-describedby": open ? `${id}-help` : undefined,
      })}
    </div>
  );
}
