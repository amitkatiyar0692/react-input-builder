import { useCallback, useState } from "react";
import { IdBuilderType, TagType } from "./InputBuilder.types";
import "./InputBuilder.css";

interface Props<IdType, DataType> {
  idBuilder: IdBuilderType<IdType, DataType>;
  labels: {
    clear: string;
    error?: string;
  };
  tagTypes: TagType<IdType, DataType>[];
  styles?: {
    groupRadius: number;
  };
  keepFocused?: boolean;
}

export default function InputBuilder<IdType, DataType>({
  idBuilder,
  labels,
  tagTypes,
  styles = { groupRadius: 4 },
  keepFocused = true,
}: Props<IdType, DataType>) {
  const { tags, focusedTagIndex, action } = idBuilder;

  const [refocus, setRefocus] = useState<boolean>(true);

  const inputRef = useCallback(
    (node: any) => {
      if (node !== null) {
        node.focus();
      }
    },
    [focusedTagIndex, refocus]
  );

  const hasError = !!labels?.error;

  const onBlur = (e) => {
    if (
      e.relatedTarget instanceof HTMLElement &&
      e.relatedTarget?.isContentEditable
    ) {
      e.relatedTarget?.focus();
    } else if (keepFocused) {
      setRefocus((refocus) => !refocus);
    }
  };

  return (
    <div id="input-builder">
      <div
        className="input-container"
        style={{
          border: `1px solid ${hasError ? "red" : "lightGrey"}`,
        }}
      >
        <div
          data-testid="id-buider-input"
          className="input"
          onBlur={onBlur}
          tabIndex={0}
          onKeyDown={action.handleDefaultKeyBoardEvent}
          ref={inputRef}
        >
          <span style={{ marginLeft: -4 }}>
            <span
              className={focusedTagIndex === -1 ? "tag tag-animation" : "tag"}
            />
          </span>

          {tags.map((tag, index) => {
            const tagType: TagType<IdType, DataType> = tagTypes.find(
              (item) => item.type === tag.type
            ) as TagType<IdType, DataType>;

            const isGroupEnded =
              index === tags.length - 1 ||
              (
                tagTypes.find(
                  (item) => item.type === tags[index + 1].type
                ) as TagType<IdType, DataType>
              ).isSeparator;

            const isGroupStarted =
              index === 0 ||
              (
                tagTypes.find(
                  (item) => item.type === tags[index - 1].type
                ) as TagType<IdType, DataType>
              ).isSeparator;

            return (
              <span
                key={tag.id}
                style={{
                  ...(tagType.styles.container || {}),
                  padding: "8px 2px",
                  backgroundColor: tagType.styles?.color,
                  borderTopRightRadius: isGroupEnded ? styles.groupRadius : 0,
                  borderBottomRightRadius: isGroupEnded
                    ? styles.groupRadius
                    : 0,
                  borderTopLeftRadius: isGroupStarted ? styles.groupRadius : 0,
                  borderBottomLeftRadius: isGroupStarted
                    ? styles.groupRadius
                    : 0,
                }}
                onClick={() => {
                  idBuilder.action.setFocused(index);
                }}
              >
                <span
                  id={tag.id}
                  className={
                    idBuilder.action.isFocused(index)
                      ? "tag  tag-animation"
                      : "tag"
                  }
                >
                  {tagType?.renderTag ? tagType.renderTag(tag) : tag.type}
                </span>
              </span>
            );
          })}
        </div>

        <button
          className="clear-btn"
          disabled={tags.length === 0}
          onClick={idBuilder.clear}
        >
          {labels.clear}
        </button>
      </div>
      {!!labels.error && <Error error={labels.error} />}
    </div>
  );
}

const Error = ({ error }: { error: string }) => {
  return (
    <div style={{ fontSize: "0.85rem", marginTop: 10, color: "red" }}>
      {error}
    </div>
  );
};
