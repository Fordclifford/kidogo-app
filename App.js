import React, { useState } from 'react';
import Amplify from 'aws-amplify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/RootReducer'
import awsconfig from './aws-exports'
import { AppLoading } from 'expo'
import { LoadFonts, ConfigureBcrypt } from './utilities/config';
import { LoadTestData, LogTestData, InitDatabase } from './utilities/localstore';
import { createAppContainer } from 'react-navigation';
import AppNavigator from './navigators/AppNavigator';

Amplify.configure(awsconfig)

const store = createStore(rootReducer)
const AppContainer = createAppContainer(AppNavigator)

const App = () => {
  const [appLoading, setAppLoading] = useState(true)


  const setupApp = async () => {
    const runTests = false

    if (runTests) {
      await LoadTestData()
      await LogTestData()
    }

    await LoadFonts()
    await InitDatabase()

    ConfigureBcrypt()
  }


  if (appLoading) {
    return (
      <AppLoading
        startAsync={setupApp}
        onFinish={() => setAppLoading(false)}
        onError={console.warn}
      />
    )
  }

  return (
    <Provider store={store} >
      <AppContainer />
    </Provider>
  )
}

export default App
