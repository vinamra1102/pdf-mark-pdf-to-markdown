import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSignIn = async () => {
    try {
      const { createdSessionId } = await startOAuthFlow();
      if (createdSessionId) {
        // session created successfully
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-3xl font-bold mb-2">PDFMark</Text>
      <Text className="text-muted-foreground text-base mb-10 text-center">
        Convert PDFs to Markdown on the go
      </Text>
      <TouchableOpacity
        onPress={handleSignIn}
        className="bg-primary w-full py-4 rounded-xl items-center mb-4"
      >
        <Text className="text-primary-foreground text-base font-semibold">Sign In</Text>
      </TouchableOpacity>
      <Text className="text-muted-foreground text-xs text-center">
        Your PDFs are processed securely in the cloud.
      </Text>
    </View>
  );
}
