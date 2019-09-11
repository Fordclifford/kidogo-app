import React, { useRef, useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { ScrollView, TouchableOpacity, Text, View } from 'react-native'
import uuid from 'uuid'
import { Colors, Styles, Size } from '../constants/Style';
import { Icon } from 'react-native-elements';
import { Get, Create } from '../utilities/localstore';
import { CHILDREN } from '../constants/Store';

import Spacer from '../components/Spacer';
import Error from '../components/Error';
import ChildEntry from '../components/ChildEntry';
import Loading from '../components/Loading';
import Backdrop from '../components/Backdrop';


const Children = (props) => {
  const { accountId } = props.navigation.state.params

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [soundObject, setSoundObject] = useState(null)
  const [error, setError] = useState(null)

  const scrollRef = useRef(null)


  const onNextChild = async () => {
    resetForm()

    setLoading(true)

    const childData = {
      accountId,
      id: uuid(),
      firstName,
      lastName,
      birthdate,
      gender,
      note,
    }

    await Create(CHILDREN, childData.id, childData)

    setLoading(false)
  }


  const onAddGuardians = async () => {
    props.navigation.navigate('Guardians')
  }


  const resetForm = () => {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    setFirstName('')
    setLastName('')
    setBirthdate('')
    setGender('')
    setNote('')
  }


  const toggleHelpAudio = async () => {
    try {
      if (soundObject) {
        await soundObject.stopAsync()

        setSoundObject(null)
      } else {
        const soundObject = new Audio.Sound()
        await soundObject.loadAsync(require('../assets/audio/children.mp3'))
        await soundObject.playAsync()

        setSoundObject(soundObject)
      }
    } catch(error) {
      console.error(error)
    }
  }


  return (
    <Backdrop>
      <Spacer height={Size.statusbar} />

      <Error message={error} />

      {loading
        ? <Loading />
        : <ScrollView ref={scrollRef} >
            <ChildEntry
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              birthdate={birthdate}
              setBirthdate={setBirthdate}
              gender={gender}
              setGender={setGender}
              note={note}
              setNote={setNote}
            />

            <Spacer medium />

            <View style={Styles.rowButtons} >
              <TouchableOpacity
                style={Styles.pairButton}
                onPress={onNextChild}
              >
                <Text style={Styles.btnText}>Next Child</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.pairButton}
                onPress={onAddGuardians}
              >
                <Text style={Styles.btnText}>Add Guardians</Text>
              </TouchableOpacity>
            </View>

            <Spacer height={Size.keyboard} />
          </ScrollView>
      }

      <TouchableOpacity
        style={Styles.helpButton}
        onPress={toggleHelpAudio}
      >
        <View style={Styles.helpButtonIcon} >
          <Icon name="record-voice-over" color={Colors.helpButton} size={36} />
        </View>
      </TouchableOpacity>

    </Backdrop>
  )
}

export default Children
