import { View, Text, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Settings as SettingsIcon, User, LogOut } from "lucide-react-native";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <View className="flex-1 bg-[#F7F7F7] px-6 pt-12">
      <View className="bg-white border-b border-[#DEDEDE] -mx-6 px-6 pb-4 mb-6">
        <View className="flex-row items-center gap-3">
          <SettingsIcon color="#F25623" size={24} />
          <Text className="text-[#171717] text-2xl font-bold">Settings</Text>
        </View>
      </View>

      {/* Avatar */}
      <View className="items-center mb-6">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-2"
          style={{ backgroundColor: "rgba(242,86,35,0.15)", borderWidth: 2, borderColor: "#F25623" }}
        >
          <Text className="text-[#F25623] text-xl font-bold">{initials}</Text>
        </View>
        <Text className="text-[#171717] font-semibold">
          {user?.fullName || "User"}
        </Text>
      </View>

      {/* Account section */}
      <Text className="text-[#4D4D4D] text-xs uppercase mb-2 tracking-wider">Account</Text>
      <View className="bg-white rounded-xl border border-[#DEDEDE] mb-6">
        <View className="flex-row items-center gap-3 p-4 border-b border-[#DEDEDE]">
          <User color="#4D4D4D" size={20} />
          <View className="flex-1">
            <Text className="text-[#171717] font-medium">Email</Text>
            <Text className="text-[#4D4D4D] text-sm">
              {user?.primaryEmailAddress?.emailAddress || user?.id || "Unknown"}
            </Text>
          </View>
        </View>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        onPress={() => signOut()}
        className="bg-white rounded-xl border border-[#DEDEDE] p-4 flex-row items-center gap-3"
      >
        <LogOut color="#F25623" size={20} />
        <Text className="text-[#F25623] font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
