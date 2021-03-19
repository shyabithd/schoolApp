import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducer/rootReducer";

const reducer = combineReducers({
userData: persistReducer(
    {
    key: "user",
    storage,
    debug: true,
    blacklist: ['foo'],
    },
    rootReducer
),
});

const reduxstore = createStore(persistReducer({
key: "root",
debug: true,
storage,
whitelist: ['auth'],
}, reducer), {});

console.log("initialState", reduxstore.getState());

const persistor = persistStore(reduxstore, null, () => {
// if you want to get restoredState
console.log("restoredState", reduxstore.getState());
});

function configureStore() {
    return { reduxstore, persistor };
}

export default configureStore;
