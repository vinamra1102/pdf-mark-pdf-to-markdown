import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { UploadCloud, FileText, AlertCircle } from "lucide-react-native";
import { useUpload } from "../../src/hooks/useUpload";
import { useStartConversion } from "../../src/hooks/useConversions";
import { UploadCard } from "../../src/components/UploadCard";

export default function UploadScreen() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const upload = useUpload();
  const startConversion = useStartConversion();
  const router = useRouter();

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedFile(result);
      }
    } catch {
      // user cancelled
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.canceled) return;
    const file = selectedFile.assets[0];
    try {
      const doc = await upload.upload(file.uri, file.name, file.mimeType || "application/pdf");
      const conv = await startConversion.mutateAsync(doc.id);
      router.push(`/conversion/${conv.id}`);
    } catch {
      // error handled by hook
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    upload.reset();
  };

  if (!selectedFile || selectedFile.canceled) {
    return (
      <View className="flex-1 bg-background px-6 pt-12">
        <View className="items-center mb-8">
          <UploadCloud color="#3b82f6" size={40} />
          <Text className="text-foreground text-2xl font-bold mt-4">Upload PDF</Text>
          <Text className="text-muted-foreground text-center mt-2">
            Select a PDF to convert to clean Markdown
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePick}
          className="border-2 border-dashed border-border rounded-2xl p-10 items-center"
        >
          <UploadCloud color="#71717a" size={48} />
          <Text className="text-muted-foreground mt-4 text-base">Tap to select PDF</Text>
          <Text className="text-muted-foreground text-xs mt-1">Up to 100MB</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const file = selectedFile.assets[0];

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <View className="items-center mb-8">
        <FileText color="#3b82f6" size={40} />
        <Text className="text-foreground text-2xl font-bold mt-4">Ready to Convert</Text>
      </View>

      <UploadCard
        filename={file.name}
        sizeBytes={file.size || 0}
        status={upload.status}
        progress={upload.progress}
        error={upload.error}
        onUpload={handleUpload}
        onCancel={handleReset}
        isConverting={startConversion.isPending}
      />
    </View>
  );
}
