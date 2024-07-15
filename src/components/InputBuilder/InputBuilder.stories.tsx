import { endsWith, map, startsWith } from "lodash";
import { ReactElement } from "react";
import InputBuilder from "./InputBuilder";
import { useIdBuilder } from "./hooks/useIdBuilder";
import { RangeTag } from "./tags/RangeTag";
import { ContentEditableStringTag } from "./tags/ContentEditableStringTag";
import { TagType } from "./InputBuilder.types";

enum IdFormat {
  Number = "N",
  AlphaChar = "A",
  AlphaCharOrNumber = "S",
  Hyphen = "-",
  Underscore = "_",
  Slash = "/",
  MY_PLACEHOLDER = "{MY_PLACEHOLDER}",
  String = '"string"',
  Range = "Range",
}

type AdditionalDataType = {
  range?: Range;
  text?: string;
};

export default {
  title: "IDBuilder",
  component: InputBuilder,
};

export const Default = (): ReactElement => {
  const allowedTags = [
    IdFormat.AlphaChar,
    IdFormat.AlphaCharOrNumber,
    IdFormat.Hyphen,
    IdFormat.Number,
    IdFormat.MY_PLACEHOLDER,
    IdFormat.Slash,
    IdFormat.Underscore,
  ];

  const idBuilder = useIdBuilder<IdFormat, AdditionalDataType>({
    initialId: "NN_SSS/{Site_ID}",
    allowedTags,
    mapTagStringToTagItem: (tag) => {
      return {
        type: tag as IdFormat,
      };
    },
    defaultAllowedKeys: [
      IdFormat.Slash,
      IdFormat.Hyphen,
      IdFormat.Underscore,
      IdFormat.AlphaChar,
      IdFormat.AlphaCharOrNumber,
      IdFormat.Number,
    ],
  });

  return (
    <div
      style={{
        width: "450px",
        margin: "1em",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        ID builder with allowed types{" "}
        {map(allowedTags, (type) => {
          return <span> {type}, </span>;
        })}
      </div>

      <InputBuilder<IdFormat, AdditionalDataType>
        idBuilder={idBuilder}
        tagTypes={getTagTypes(idBuilder.action.onChangeData)}
        labels={{ clear: "Clear" }}
      />
    </div>
  );
};

export const StringContent = (): ReactElement => {
  const allowedTags = [IdFormat.String, IdFormat.AlphaChar, IdFormat.Number];

  const idBuilder = useIdBuilder<IdFormat, AdditionalDataType>({
    initialId: 'NN"mystring"AA',
    allowedTags,
    mapTagStringToTagItem: (tag) => {
      if (startsWith(tag, '"') && endsWith(tag, '"')) {
        return {
          type: IdFormat.String,
          data: { text: tag },
        };
      }
      return {
        type: tag as IdFormat,
      };
    },
    defaultAllowedKeys: [],
  });

  return (
    <div
      style={{
        width: "450px",
        margin: "1em",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        ID builder with allowed types{" "}
        {map(allowedTags, (type) => {
          return <span> {type}, </span>;
        })}
      </div>

      <InputBuilder<IdFormat, AdditionalDataType>
        idBuilder={idBuilder}
        tagTypes={getTagTypes(idBuilder.action.onChangeData)}
        labels={{ clear: "Clear" }}
      />
    </div>
  );
};

const getTagTypes = (
  onChangeData: (id: string, content: AdditionalDataType) => void
): TagType<IdFormat, AdditionalDataType>[] => {
  return [
    {
      type: IdFormat.AlphaChar,
      styles: {
        color: "#fabb91",
      },
    },
    {
      type: IdFormat.Number,
      styles: {
        color: "#b4d8f1",
      },
    },
    {
      type: IdFormat.AlphaCharOrNumber,
      styles: {
        color: "#ffdea1",
      },
    },
    {
      type: IdFormat.MY_PLACEHOLDER,
      styles: {
        color: "#bce4b4",
      },
    },
    {
      type: IdFormat.Range,
      styles: {
        color: "#FFDEFC",
        container: { padding: "0px 1px" },
      },
      renderTag: (tag) => {
        return (
          <RangeTag
            label={"Range"}
            range={tag.data?.range}
            onClick={() => alert("Clicked on Range")}
          />
        );
      },
    },
    {
      type: IdFormat.String,
      styles: {
        color: "#ff6347",
      },
      renderTag: (tag) => {
        return (
          <ContentEditableStringTag
            value={tag.data?.text}
            onChange={(content) => {
              onChangeData(tag.id, { text: content });
            }}
          />
        );
      },
    },
    {
      type: IdFormat.Hyphen,
      isSeparator: true,
      styles: {
        color: "#ffff",
      },
    },
    {
      type: IdFormat.Underscore,
      isSeparator: true,
      styles: {
        color: "#ffff",
      },
    },
    {
      type: IdFormat.Slash,
      isSeparator: true,
      styles: {
        color: "#ffff",
      },
    },
  ];
};
