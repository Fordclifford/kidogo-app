import React, { useState } from 'react'
import { TextInput, Text, TouchableOpacity, View } from 'react-native'
import { Styles } from '../constants/Style';
import Spacer from '../components/Spacer';
import { SignInCaregiver } from '../utilities/auth';
import Loading from '../components/Loading';
import { ListDB } from '../utilities/dbstore';
import { CreateCaregiver } from '../utilities/localstore';
import Backdrop from '../components/Backdrop';
import Language from '../languages'
import SecureInput from '../components/SecureInput';
import { CAREGIVER } from '../constants/Store';


const SignIn = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const onSignIn = async () => {
    setLoading(true)

    await SignInCaregiver(username, password)

    const caregiversResp = await ListDB(CAREGIVER)
    const caregivers = caregiversResp["data"]["listCaregivers"]["items"]

    console.log(caregivers)

    for (const caregiver of caregivers) {
      if (caregiver.username === username) {
        await CreateCaregiver(caregiver)
        break
      }
    }

    setLoading(false)

    props.navigation.navigate('Dash')
  }


  return (
    <Backdrop>
      {loading
        ? <Loading />
        : <View>
            <Spacer large />

            <Text style={[Styles.h1, { fontSize: 35 }, Styles.raleway]} >
              { Language.SignIn }
            </Text>

            <TextInput
              style={Styles.input}
              value={username}
              onChangeText={setUsername}
              blurOnSubmit={false}
            />

            <Text style={Styles.label} >
              { Language.Username }
            </Text>

            <SecureInput
              value={password}
              setValue={setPassword}
            />

            <Text style={Styles.label} >
              { Language.Password }
            </Text>

            <Spacer large />

            <TouchableOpacity
              style={Styles.mainButton}
              onPress={onSignIn}
            >
              <Text style={Styles.buttonText}>{ Language.Confirm }</Text>
            </TouchableOpacity>
          </View>
      }
    </Backdrop>
  )
}


export default SignIn

