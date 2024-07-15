import { useRef, MouseEvent } from "react";

interface Props {
  value: string;
  onChange: (content: string) => void;
}

export const ContentEditableStringTag = ({ value, onChange }: Props) => {
  const defaultValue = useRef(value || "");
  const editableSpanRef = useRef<HTMLInputElement>();
  return (
    <span
      onDoubleClick={(e: MouseEvent<HTMLInputElement>) => {
        editableSpanRef.current.focus();
        e.preventDefault();
      }}
    >
      {'"'}
      <span
        ref={editableSpanRef}
        spellCheck={false}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          onChange(`"${e.currentTarget.textContent}"`);
        }}
        onKeyDown={(event) => {
          if (value !== '""') {
            event.stopPropagation();
          }
        }}
      >
        {defaultValue.current.replace(/"/g, "")}
      </span>
      {'"'}
    </span>
  );
};
