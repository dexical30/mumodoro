import * as React from "react";
import { cn } from "./utils";

type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label"
  | "strong"
  | "em"
  | "b"
  | "i"
  | "small"
  | "sub"
  | "sup"
  | "code"
  | "pre"
  | "blockquote";

type TextProps<T extends TextElement = "p"> = {
  as?: T;
} & React.HTMLAttributes<HTMLElementTagNameMap[T]>;

function Text<T extends TextElement = "p">({
  as,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Component = (as || "p") as T;

  return React.createElement(
    Component,
    {
      className: cn(className),
      ...props,
    },
    children
  );
}

export { Text, type TextProps, type TextElement };
