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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  if (!conversion) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-foreground text-lg font-semibold mb-2">Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <ArrowLeft color="#fafafa" size={20} />
          <Text className="text-foreground text-base">Back</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3">
          {conversion.status === ConversionStatus.COMPLETED && (
            <TouchableOpacity onPress={handleShare}>
              <Share2 color="#fafafa" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-xl font-bold mb-1">Conversion</Text>
        <Text className="text-muted-foreground text-sm mb-4">
          {new Date(conversion.created_at).toLocaleString()}
        </Text>

        <View className="flex-row items-center gap-4 mb-6">
          <StatusBadge status={conversion.status} />
          {conversion.pdf_type && (
            <Text className="text-muted-foreground text-sm">{conversion.pdf_type}</Text>
          )}
          {conversion.page_count && (
            <Text className="text-muted-foreground text-sm">{conversion.page_count} pages</Text>
          )}
        </View>

        {conversion.status === ConversionStatus.PROCESSING && (
          <View className="items-center py-12">
            <ActivityIndicator color="#3b82f6" size="large" />
            <Text className="text-muted-foreground mt-4">Processing your PDF...</Text>
          </View>
        )}

        {conversion.status === ConversionStatus.FAILED && (
          <View className="bg-red-500/10 rounded-xl border border-red-500/20 p-4">
            <Text className="text-red-400 font-semibold mb-1">Conversion Failed</Text>
            <Text className="text-muted-foreground text-sm">
              {conversion.error_message || "Unknown error"}
            </Text>
          </View>
        )}

        {conversion.status === ConversionStatus.COMPLETED && conversion.markdown_content && (
          <View className="bg-card rounded-xl border border-border p-4 mb-8">
            <Text className="text-muted-foreground text-xs font-mono leading-5" selectable>
              {conversion.markdown_content.slice(0, 5000)}
              {conversion.markdown_content.length > 5000 && "\n\n... (truncated)"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
