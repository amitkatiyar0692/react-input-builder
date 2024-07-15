import { CSSProperties, ReactNode } from "react";

export interface TagItem<IdType, DataType> {
  type: IdType;
  id?: string;
  data?: DataType;
}

export interface IdBuilderType<IdType, DataType> {
  tags: TagItem<IdType, DataType>[];
  action: {
    insert: (tag: TagItem<IdType, DataType>) => void;
    upsertById: (tag: TagItem<IdType, DataType>, id: string) => void;
    onChangeData: (id: string, data: DataType) => void;
    removeBackward: () => void;
    removeForward: () => void;
    goForward: () => void;
    goBackward: () => void;
    setFocused: (index: number) => void;
    isFocused: (index: number) => boolean;
    handleDefaultKeyBoardEvent: (event: any) => void;
  };
  focusedTagIndex: number;
  allowedKeys: string[];
  clear: () => void;
}

export interface TagType<IdType, DataType> {
  type: IdType;
  isSeparator?: boolean;
  styles: {
    color: string;
    container?: CSSProperties;
  };
  renderTag?: (tag: TagItem<IdType, DataType>) => ReactNode;
}
