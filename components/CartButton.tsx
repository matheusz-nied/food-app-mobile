import { images } from "@/constants";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CartButton() {
    const totalItems = 10;
    return (
        <TouchableOpacity className="cart-btn" onPress={() => {}}>
            <Image source={images.bag} className="size-6" resizeMode="contain" />
            {
                totalItems > 0 && (
                    <View className="cart-badge">
                        <Text className="small-bold text-white">{totalItems}</Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}