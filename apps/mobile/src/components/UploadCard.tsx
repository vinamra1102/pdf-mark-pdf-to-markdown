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
    <View className="bg-card rounded-xl border border-border p-4">
      <View className="flex-row items-center gap-3 mb-4">
        <FileText color="#3b82f6" size={32} />
        <View className="flex-1">
          <Text className="text-foreground font-medium" numberOfLines={1}>{filename}</Text>
          <Text className="text-muted-foreground text-sm">{sizeMB} MB</Text>
        </View>
      </View>

      {status === "idle" && (
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onUpload}
            disabled={isConverting}
            className="flex-1 bg-primary py-3 rounded-lg items-center"
          >
            {isConverting ? (
              <ActivityIndicator color="#fafafa" size="small" />
            ) : (
              <Text className="text-primary-foreground font-semibold">Upload & Convert</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="bg-secondary py-3 px-6 rounded-lg">
            <Text className="text-muted-foreground">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "uploading" && (
        <View>
          <View className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-muted-foreground text-sm text-center">{progress}%</Text>
        </View>
      )}

      {(status === "done" || status === "error") && (
        <TouchableOpacity onPress={onCancel} className="bg-secondary py-3 rounded-lg items-center">
          <Text className="text-muted-foreground">Upload another</Text>
        </TouchableOpacity>
      )}

      {error && (
        <Text className="text-red-400 text-sm mt-3">{error}</Text>
      )}
    </View>
  );
}
