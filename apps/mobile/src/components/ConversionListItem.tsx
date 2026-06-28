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
      className="bg-white rounded-xl border-b border-[#DEDEDE] p-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        <View
          className="w-9 h-9 rounded-lg items-center justify-center"
          style={{ backgroundColor: "rgba(242,86,35,0.1)" }}
        >
          <Text className="text-[#F25623] text-base font-bold">P</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#171717] font-medium text-sm mb-1">
            {conversion.id.slice(0, 10)}...
          </Text>
          <Text className="text-[#4D4D4D] text-xs">
            {new Date(conversion.created_at).toLocaleDateString()}
            {conversion.pdf_type && ` · ${conversion.pdf_type}`}
            {conversion.page_count && ` · ${conversion.page_count}p`}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <StatusBadge status={conversion.status} />
        <ChevronRight color="#4D4D4D" size={16} />
      </View>
    </TouchableOpacity>
  );
}
