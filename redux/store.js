import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

// CHANGE ALL THIS FOR CORRECT PERSISTENCE
let store;
if (typeof window !== 'undefined') {
    const persistConfig = {
        key: 'user',
        storage: AsyncStorage,
        whitelist: ['user'], // place to select which state you want to persist
    }
    
    const persistedReducer = persistReducer(persistConfig,reducer);
    
    store = createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware())
    );
    store.__PERSISTOR = persistStore(store);

} else {
    store = createStore(
        reducer,
        composeWithDevTools(applyMiddleware())
    );
}

export default store;