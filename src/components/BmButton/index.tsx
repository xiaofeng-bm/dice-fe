import { Button } from "@tarojs/components";
import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

interface BmButtonProps extends PropsWithChildren {
  type?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

const BmButton = ({
  type,
  className,
  disabled = false,
  style,
  onClick,
  children,
  ...rest
}: BmButtonProps) => {
  return (
    <Button
      className={classNames([styles["container"]], className, {
        [styles["primary"]]: type === "primary",
        [styles["success"]]: type === "success",
        [styles["warn"]]: type === "warn",
        [styles["disabled"]]: disabled,
      })}
      style={style}
      onClick={(e: any) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};
export default BmButton;
