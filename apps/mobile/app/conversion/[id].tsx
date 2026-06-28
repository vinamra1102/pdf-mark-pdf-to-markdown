import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Download, Share2 } from "lucide-react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useConversion } from "../../src/hooks/useConversions";
import { StatusBadge } from "../../src/components/StatusBadge";
import { ConversionStatus } from "@pdfmark/shared";

export default function ConversionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: conversion, isLoading } = useConversion(id);

  const handleShare = async () => {
    if (!conversion?.markdown_content) return;
    try {
      const fileUri = FileSystem.cacheDirectory + `conversion-${id}.md`;
      await FileSystem.writeAsStringAsync(fileUri, conversion.markdown_content);
      await Sharing.shareAsync(fileUri);
    } catch {
      // ignored
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#171717] items-center justify-center">
        <ActivityIndicator color="#F25623" size="large" />
      </View>
    );
  }

  if (!conversion) {
    return (
      <View className="flex-1 bg-[#171717] items-center justify-center px-6">
        <Text className="text-white text-lg font-semibold mb-2">Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#F25623] font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pt-14 pb-4"
        style={{ backgroundColor: "#171717", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" }}
      >
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <ArrowLeft color="#F25623" size={20} />
          <Text className="text-white text-base">Back</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3">
          {conversion.status === ConversionStatus.COMPLETED && (
            <TouchableOpacity
              onPress={handleShare}
              className="bg-[#F25623] px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Download color="#FFFFFF" size={16} />
              <Text className="text-white font-semibold text-sm">Download</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[#171717] text-xl font-bold mb-1">Conversion</Text>
        <Text className="text-[#4D4D4D] text-sm mb-4">
          {new Date(conversion.created_at).toLocaleString()}
        </Text>

        <View className="flex-row items-center gap-4 mb-6">
          <StatusBadge status={conversion.status} />
          {conversion.pdf_type && (
            <Text className="text-[#4D4D4D] text-sm">{conversion.pdf_type}</Text>
          )}
          {conversion.page_count && (
            <Text className="text-[#4D4D4D] text-sm">{conversion.page_count} pages</Text>
          )}
        </View>

        {conversion.status === ConversionStatus.PROCESSING && (
          <View className="items-center py-12">
            <ActivityIndicator color="#F25623" size="large" />
            <Text className="text-[#4D4D4D] mt-4">Processing your PDF...</Text>
          </View>
        )}

        {conversion.status === ConversionStatus.FAILED && (
          <View className="bg-red-50 rounded-xl border border-red-200 p-4">
            <Text className="text-red-600 font-semibold mb-1">Conversion Failed</Text>
            <Text className="text-[#4D4D4D] text-sm">
              {conversion.error_message || "Unknown error"}
            </Text>
          </View>
        )}

        {conversion.status === ConversionStatus.COMPLETED && conversion.markdown_content && (
          <View className="bg-white rounded-xl border border-[#DEDEDE] p-4 mb-4">
            <Text className="text-[#171717] text-xs font-mono leading-5" selectable>
              {conversion.markdown_content.slice(0, 5000)}
              {conversion.markdown_content.length > 5000 && "\n\n... (truncated)"}
            </Text>
          </View>
        )}

        {conversion.status === ConversionStatus.COMPLETED && (
          <TouchableOpacity
            onPress={handleShare}
            className="bg-[#F25623] py-4 rounded-xl items-center mb-8"
          >
            <Text className="text-white font-bold text-base">Share Markdown</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
