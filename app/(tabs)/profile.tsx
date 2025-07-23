import CustomButton from "@/components/CustomButton";
import { account } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, setUser, setIsAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await account.deleteSession('current');
            setUser(null);
            setIsAuthenticated(false);
            router.replace('/sign-in');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#FF6B00" />
                <Text className="mt-4 paragraph-medium text-gray-100">Carregando perfil...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <View className="my-5">
                    <View className="flex-between flex-row w-full">
                        <View className="flex-start">
                            <Text className="small-bold uppercase text-primary">Perfil</Text>
                            <View className="flex-start flex-row gap-x-1 mt-0.5">
                                <Text className="paragraph-semibold text-dark-100">Suas informações</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Profile Header */}
                <View className="items-center mb-8">
                    <View className="rounded-full overflow-hidden border-4 border-primary mb-4">
                        <Image 
                            source={{ uri: user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) }} 
                            className="size-32" 
                            resizeMode="cover" 
                        />
                    </View>
                    <Text className="heading3-bold text-dark-100">{user.name}</Text>
                    <Text className="paragraph-medium text-gray-100">{user.email}</Text>
                </View>

                {/* Profile Info */}
                <View className="bg-gray-50 rounded-xl p-5 mb-6">
                    <Text className="base-semibold text-dark-100 mb-4">Informações da Conta</Text>
                    
                    <View className="mb-4">
                        <Text className="small-medium text-gray-100">Nome</Text>
                        <Text className="paragraph-medium text-dark-100">{user.name}</Text>
                    </View>
                    
                    <View className="mb-4">
                        <Text className="small-medium text-gray-100">Email</Text>
                        <Text className="paragraph-medium text-dark-100">{user.email}</Text>
                    </View>
                    
 
                </View>

                {/* Actions */}
                <View className="mt-24 mb-8">
                    <CustomButton 
                        title="Sair da Conta" 
                        onPress={handleLogout} 
                        isLoading={isLoading}
                        style="bg-red-500"
                    />
                </View>

                {/* App Info */}
                <View className="items-center mb-10">
                    <Text className="small-medium text-gray-100">Fast Food App v1.0.0</Text>
                    <Text className="small-regular text-gray-100 mt-1">© 2025 Todos os direitos reservados</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
