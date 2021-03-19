import '../styles/global.css'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from "./Configure";

const { reduxstore, persistor } = configureStore();

export default function App({ Component, pageProps }) {
    return (<Provider store={reduxstore}>
            <PersistGate persistor={persistor}>
              <Component {...pageProps} />
              </PersistGate>
              </Provider>);
  }