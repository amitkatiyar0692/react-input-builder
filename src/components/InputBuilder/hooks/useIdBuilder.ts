import { useMemo, useState } from "react";
import { clone, findIndex, includes, isEmpty, map } from "lodash";
import { v4 as uuid } from "uuid";
import { IdBuilderType, TagItem } from "../InputBuilder.types";

export function useIdBuilder<IdType, DataType>({
  initialId,
  allowedTags,
  mapTagStringToTagItem,
  defaultAllowedKeys,
}: {
  initialId: string;
  allowedTags: IdType[];
  defaultAllowedKeys: string[];
  mapTagStringToTagItem: (tagString: string) => TagItem<IdType, DataType>;
}): IdBuilderType<IdType, DataType> {
  const defaultTags = useMemo(() => {
    if (initialId) {
      const regexPattern = allowedTags.join("|");
      const regex = new RegExp(`(${regexPattern})|("[^"]+")`, "g");
      return map(initialId.match(regex), (item) => {
        return { ...mapTagStringToTagItem(item), id: uuid() };
      });
    } else {
      return [];
    }
  }, [initialId, allowedTags]);

  const [tags, setTags] = useState<TagItem<IdType, DataType>[]>(defaultTags);
  const [allowedKeys] = useState<string[]>(defaultAllowedKeys);

  const [focusedTagIndex, setFocusedTagIndex] = useState<number>(
    tags.length - 1
  );

  const insert = (tag: TagItem<IdType, DataType>) => {
    const newTag = { ...tag, id: uuid() };
    const newTags = clone(tags);
    newTags.splice(focusedTagIndex + 1, 0, newTag);
    setFocusedTagIndex(focusedTagIndex + 1);
    setTags(newTags);
  };

  const upsertById = (tag: TagItem<IdType, DataType>, id: string) => {
    const itemIndex = findIndex<TagItem<IdType, DataType>>(tags, { id: id });
    const newTag = { ...tag, id: itemIndex !== -1 ? id : uuid() };
    const newTags = clone(tags);
    if (itemIndex !== -1) {
      newTags[itemIndex] = newTag;
      setFocusedTagIndex(itemIndex);
    } else {
      newTags.splice(focusedTagIndex + 1, 0, newTag);
      setFocusedTagIndex(focusedTagIndex + 1);
    }

    setTags(newTags);
  };

  const removeBackward = () => {
    if (focusedTagIndex > -1) {
      const newTags = clone(tags);
      newTags.splice(focusedTagIndex, 1);
      setTags(newTags);
      setFocusedTagIndex(focusedTagIndex - 1);
    }
  };

  const removeForward = () => {
    if (focusedTagIndex < tags.length - 1) {
      const newTags = clone(tags);
      newTags.splice(focusedTagIndex + 1, 1);
      setTags(newTags);
    }
  };

  const goForward = () => {
    if (focusedTagIndex < tags.length - 1) {
      setFocusedTagIndex(focusedTagIndex + 1);
    }
  };

  const goBackward = () => {
    if (focusedTagIndex > -1) {
      setFocusedTagIndex(focusedTagIndex - 1);
    }
  };

  function clear(): void {
    setTags([]);
    setFocusedTagIndex(-1);
  }

  const isFocused = (index: number) => focusedTagIndex === index;

  const handleDefaultKeyBoardEvent = (event) => {
    if (event.target.isContentEditable && !isEmpty(event.target.innerText)) {
      return;
    }

    if (event.code === "Backspace") {
      removeBackward();
    }
    if (event.code === "Delete") {
      removeForward();
    }
    if (event.code === "ArrowLeft") {
      goBackward();
    }
    if (event.code === "ArrowRight") {
      goForward();
    }
    if (includes(allowedKeys, event.key)) {
      insert({ type: event.key as IdType, data: null });
    }
  };

  const onChangeData = (id: string, data: DataType) => {
    const index = findIndex(tags, { id: id });
    const newTags = clone(tags);
    newTags[index].data = { ...(newTags[index].data || {}), ...data };
    setTags(newTags);
  };

  return {
    tags,
    focusedTagIndex,
    clear,
    action: {
      insert,
      upsertById,
      onChangeData,
      removeBackward,
      removeForward,
      goForward,
      goBackward,
      setFocused: setFocusedTagIndex,
      isFocused,
      handleDefaultKeyBoardEvent,
    },
    allowedKeys,
  };
}
