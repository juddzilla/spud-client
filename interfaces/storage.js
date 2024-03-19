// npm install @react-native-async-storage/async-storage
import * as SecureStore from 'expo-secure-store';

class Storage {
    async get(key) {
        const value = await SecureStore.getItemAsync(key);
        return JSON.parse(value);
    }

    async remove(key) {
        await SecureStore.deleteItemAsync(key, value);
        return true;
    }

    async set(key, value) {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
}

export default new Storage();