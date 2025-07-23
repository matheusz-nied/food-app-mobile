import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    try {
        const list = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId
        );

        if (list.documents.length > 0) {
            await Promise.all(
                list.documents.map((doc) =>
                    databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
                )
            );
        }
        console.log(`Cleared collection ${collectionId}`);
    } catch (error) {
        console.error(`Error clearing collection ${collectionId}:`, error);
        // Continue execution even if clearing fails
    }
}

async function clearStorage(): Promise<void> {
    try {
        const list = await storage.listFiles(appwriteConfig.bucketId);

        if (list.files.length > 0) {
            await Promise.all(
                list.files.map((file) =>
                    storage.deleteFile(appwriteConfig.bucketId, file.$id)
                )
            );
        }
        console.log(`Cleared storage ${appwriteConfig.bucketId}`);
    } catch (error) {
        console.error(`Error clearing storage ${appwriteConfig.bucketId}:`, error);
        // Continue execution even if clearing fails
    }
}

async function uploadImageToStorage(imageUrl: string) {
    try {
        console.log(`🔄 Tentando fazer upload da imagem: ${imageUrl}`);
        
        // Extrair o nome do arquivo da URL
        const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;
        
        // Criar um ID único para o arquivo
        const fileId = ID.unique();
        
        // No React Native/Expo, não podemos fazer upload direto de URLs externas
        // Vamos registrar a URL no Appwrite como um arquivo externo
        const file = await storage.createFile(
            appwriteConfig.bucketId,
            fileId,
            {
                name: fileName,
                type: 'image/jpeg',
                size: 1, // Tamanho fictício
                uri: imageUrl
            }
        );
        
        // Obter a URL de visualização do arquivo
        const fileUrl = storage.getFileView(appwriteConfig.bucketId, fileId);
        console.log(`✅ Imagem registrada com sucesso: ${fileUrl}`);
        
        return fileUrl;
    } catch (error) {
        console.error(`❌ Erro ao fazer upload da imagem ${imageUrl}:`, error);
        console.log(`⚠️ Usando URL original como fallback: ${imageUrl}`);
        // Em caso de falha, retornar a URL original como fallback
        return imageUrl;
    }
}
async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationsCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationsCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;
