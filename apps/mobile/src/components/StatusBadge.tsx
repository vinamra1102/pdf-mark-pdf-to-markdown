import { View, Text } from "react-native";
import { ConversionStatus } from "@pdfmark/shared";

const statusColors: Record<string, { bg: string; text: string }> = {
  [ConversionStatus.PENDING]: { bg: "#DEDEDE", text: "#4D4D4D" },
  [ConversionStatus.PROCESSING]: { bg: "rgba(242,86,35,0.1)", text: "#F25623" },
  [ConversionStatus.COMPLETED]: { bg: "#f0fdf4", text: "#15803d" },
  [ConversionStatus.FAILED]: { bg: "#fef2f2", text: "#dc2626" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors[ConversionStatus.PENDING];

  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: colors.bg }}>
      <Text className="text-xs font-semibold" style={{ color: colors.text }}>
        {status}
      </Text>
    </View>
  );
}
