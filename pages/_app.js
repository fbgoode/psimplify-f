import '../styles/globals.css';
import '../styles/Input.css';
import '../styles/Dropdown.css';
import '../styles/Tooltip.css';
import '../styles/Spin.css';
import '../styles/Calendar.css';
import '../styles/notification.css';

//Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from '../redux/store';

//Amplify
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import config from '../config';
Auth.configure(config.Auth);
API.configure(config.API);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__PERSISTOR}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default MyApp;