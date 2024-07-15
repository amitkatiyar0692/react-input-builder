export interface Range {
  start: string;
  end: string;
}

interface Props {
  range: Range;
  label: string;
  onClick: () => void;
}

export const RangeTag = ({ range, label, onClick }: Props) => {
  return (
    <button
      style={{
        color: "black",
        height: "32px",
        paddingInlineEnd: 4,
        borderRadius: 0,
      }}
      onClick={onClick}
      //   endIcon={<EditIcon />}
    >
      {`${label} `}
      <span style={{ fontStyle: "italic" }}>
        ({range?.start}-{range?.end})
      </span>
    </button>
  );
};
