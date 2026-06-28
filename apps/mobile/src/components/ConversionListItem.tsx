import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { StatusBadge } from "./StatusBadge";
import type { Conversion } from "@pdfmark/shared";

interface ConversionListItemProps {
  conversion: Conversion;
  onPress: () => void;
}

export function ConversionListItem({ conversion, onPress }: ConversionListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-card rounded-xl border border-border p-4 flex-row items-center justify-between"
    >
      <View className="flex-1 mr-3">
        <Text className="text-foreground font-medium text-sm mb-1">
          {conversion.id.slice(0, 10)}...
        </Text>
        <Text className="text-muted-foreground text-xs">
          {new Date(conversion.created_at).toLocaleDateString()}
          {conversion.pdf_type && ` · ${conversion.pdf_type}`}
          {conversion.page_count && ` · ${conversion.page_count}p`}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <StatusBadge status={conversion.status} />
        <ChevronRight color="#71717a" size={16} />
      </View>
    </TouchableOpacity>
  );
}
