"use client";

import {
  Button,
  FieldLabel,
  TextInput,
  useField,
  useForm,
} from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React from "react";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = TextFieldClientProps & { useAsSlug?: string };

export const SlugInput: React.FC<Props> = ({
  field,
  path,
  useAsSlug = "title",
}) => {
  const { label, required } = field;
  const fieldPath = path || field.name;

  const { setValue, value } = useField<string>({ path: fieldPath });
  const { getDataByPath } = useForm();

  const handleGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    const source = getDataByPath(useAsSlug) as string | undefined;
    if (source) setValue(toSlug(source));
  };

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel
          htmlFor={`field-${fieldPath}`}
          label={label}
          required={required}
        />
        <Button
          buttonStyle="none"
          className="lock-button"
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </div>
      <TextInput onChange={setValue} path={fieldPath} value={value ?? ""} />
    </div>
  );
};
