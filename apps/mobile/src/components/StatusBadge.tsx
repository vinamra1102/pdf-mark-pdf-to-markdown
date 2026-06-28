import { View, Text } from "react-native";
import { ConversionStatus } from "@pdfmark/shared";

const statusColors: Record<string, { bg: string; text: string }> = {
  [ConversionStatus.PENDING]: { bg: "#92400e20", text: "#fbbf24" },
  [ConversionStatus.PROCESSING]: { bg: "#1e3a5f20", text: "#3b82f6" },
  [ConversionStatus.COMPLETED]: { bg: "#064e3b20", text: "#34d399" },
  [ConversionStatus.FAILED]: { bg: "#7f1d1d20", text: "#f87171" },
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
