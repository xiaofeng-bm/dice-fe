import { Button } from "@tarojs/components";
import { PropsWithChildren } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

interface BmButtonProps extends PropsWithChildren {
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [key: string]: any
}

const BmButton = ({
  type,
  className,
  style,
  children,
  ...rest
}: BmButtonProps) => {
  return (
    <Button
      className={classNames([styles["container"]], className, {
        [styles["primary"]]: type === "primary",
        [styles['success']]: type === "success",
        [styles["warn"]]: type === "warn",
      })}
      style={style}
      {...rest}
    >
      {children}
    </Button>
  );
};
export default BmButton;
