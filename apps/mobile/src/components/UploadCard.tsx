import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FileText } from "lucide-react-native";

interface UploadCardProps {
  filename: string;
  sizeBytes: number;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
  error: string | null;
  onUpload: () => void;
  onCancel: () => void;
  isConverting: boolean;
}

export function UploadCard({
  filename,
  sizeBytes,
  status,
  progress,
  error,
  onUpload,
  onCancel,
  isConverting,
}: UploadCardProps) {
  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);

  return (
    <View className="bg-[#222222] rounded-2xl border border-white/10 p-4">
      <View className="flex-row items-center gap-3 mb-4">
        <FileText color="#F25623" size={32} />
        <View className="flex-1">
          <Text className="text-white font-semibold" numberOfLines={1}>{filename}</Text>
          <Text className="text-white/45 text-sm">{sizeMB} MB</Text>
        </View>
      </View>

      {status === "idle" && (
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onUpload}
            disabled={isConverting}
            className="flex-1 bg-brand-orange py-3 rounded-xl items-center"
          >
            {isConverting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-bold">Upload & Convert</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="bg-[#4D4D4D] py-3 px-6 rounded-xl">
            <Text className="text-white/45">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "uploading" && (
        <View>
          <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-brand-orange rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-white/45 text-sm text-center">{progress}%</Text>
        </View>
      )}

      {(status === "done" || status === "error") && (
        <TouchableOpacity onPress={onCancel} className="bg-[#4D4D4D] py-3 rounded-xl items-center">
          <Text className="text-white/45">Upload another</Text>
        </TouchableOpacity>
      )}

      {error && (
        <Text className="text-red-400 text-sm mt-3">{error}</Text>
      )}
    </View>
  );
}
