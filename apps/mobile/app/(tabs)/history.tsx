import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { Clock } from "lucide-react-native";
import { useConversions } from "../../src/hooks/useConversions";
import { ConversionListItem } from "../../src/components/ConversionListItem";
import type { Conversion } from "@pdfmark/shared";
import { ConversionStatus } from "@pdfmark/shared";

const tabs = [
  { label: "All", value: undefined },
  { label: "Done", value: ConversionStatus.COMPLETED },
  { label: "Failed", value: ConversionStatus.FAILED },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<string | undefined>();
  const { data, isLoading, refetch, isRefetching } = useConversions(1, 50, status);

  const handlePress = (conv: Conversion) => {
    router.push(`/conversion/${conv.id}`);
  };

  return (
    <View className="flex-1 bg-[#F7F7F7] px-6 pt-12">
      <View className="bg-white border-b border-[#DEDEDE] -mx-6 px-6 pb-4 mb-4">
        <View className="flex-row items-center gap-3 mb-4">
          <Clock color="#F25623" size={24} />
          <Text className="text-[#171717] text-2xl font-bold">History</Text>
        </View>

        <View className="flex-row gap-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setStatus(tab.value)}
              className={`px-4 py-2 rounded-full ${status === tab.value ? "bg-brand-orange" : "bg-[#DEDEDE]"}`}
            >
              <Text className={status === tab.value ? "text-white font-semibold" : "text-[#4D4D4D]"}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F25623" size="large" />
        </View>
      ) : !data?.items?.length ? (
        <View className="flex-1 items-center justify-center">
          <Clock color="#4D4D4D" size={40} />
          <Text className="text-[#4D4D4D] mt-4">No conversions yet</Text>
        </View>
      ) : (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversionListItem conversion={item} onPress={() => handlePress(item)} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#F25623" />
          }
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
