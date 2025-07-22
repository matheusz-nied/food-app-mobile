import { MenuItem } from "@/type";
import { Image, Platform, Text, TouchableOpacity } from 'react-native';
// import {appwriteConfig} from "@/lib/appwrite";
// import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item}: { item: MenuItem}) => {
    // const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
    // const { addItem } = useCartStore();
    const imageUrl = "image_url";
    const addItem = (item: MenuItem) => {};

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{item.name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From ${item.price}</Text>
            <TouchableOpacity onPress={() => addItem({...item})}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default MenuCard
