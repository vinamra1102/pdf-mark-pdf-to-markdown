import { View, Text, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Settings as SettingsIcon, User, LogOut } from "lucide-react-native";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <View className="flex-row items-center gap-3 mb-8">
        <SettingsIcon color="#3b82f6" size={24} />
        <Text className="text-foreground text-2xl font-bold">Settings</Text>
      </View>

      <View className="bg-card rounded-xl border border-border p-4 mb-4">
        <View className="flex-row items-center gap-3 mb-4">
          <User color="#71717a" size={20} />
          <Text className="text-foreground font-semibold">Account</Text>
        </View>
        <Text className="text-muted-foreground text-sm">
          {user?.primaryEmailAddress?.emailAddress || user?.id || "Unknown"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => signOut()}
        className="bg-card rounded-xl border border-border p-4 flex-row items-center gap-3"
      >
        <LogOut color="#ef4444" size={20} />
        <Text className="text-red-500 font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
