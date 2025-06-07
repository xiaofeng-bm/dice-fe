// components/Spin.tsx
import React from "react";
import { View } from "@tarojs/components";
import { Loading } from "@nutui/nutui-react-taro";

interface SpinProps {
  spinning?: boolean;
  tip?: string;
  size?: "small" | "default" | "large";
  children?: React.ReactNode;
}


const Spin: React.FC<SpinProps> = ({
  spinning = true,
  tip,
  children,
}) => {
  return (
    <View style={{ position: "relative" }}>
      {spinning && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Loading />
          {tip && (
            <View style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
              {tip}
            </View>
          )}
        </View>
      )}
      <View style={{ opacity: spinning ? 0.4 : 1 }}>{children}</View>
    </View>
  );
};
export default Spin;