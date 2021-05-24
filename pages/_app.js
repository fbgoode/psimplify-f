import '../styles/globals.css';
import '../styles/Input.css';
import '../styles/Dropdown.css';
import '../styles/Tooltip.css';
import '../styles/Spin.css';
import '../styles/Calendar.css';
import '../styles/notification.css';
import '../styles/Modal.css';
import '../styles/Select.css';
import '../styles/Button.css';
import '../styles/Icon.css';
import '../styles/Steps.css';
import '../styles/Result.css';
import Head from 'next/head';

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
        <Head>
          <link rel="shortcut icon" href="favicon.png" />
          <title>Psimplify</title>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default MyApp;