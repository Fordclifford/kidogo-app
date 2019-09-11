import React, { useEffect, useState } from 'react'
import { Text, ScrollView, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av'
import { GetFullDate, GetShortDate } from '../utilities/dates';
import { Styles, Size } from '../constants/Style';

import Spacer from '../components/Spacer';
import Backdrop from '../components/Backdrop';
import AttendanceCard from '../components/AttendanceCard'
import { ATTENDANCE, CHILDREN } from '../constants/Store';
import { Get, Create, Update, GetIds } from '../utilities/localstore';


const CheckIn = (props) => {
  const [checkInData, setCheckInData] = useState(null)
  const [soundObject, setSoundObject] = useState(null)


  useEffect(() => {
    getCheckInData()
  }, [])


  const getAttendanceToday = async () => {
  }


  const getCheckInData = async () => {
    const today = GetShortDate()
    const children = await Get(CHILDREN)
    const attendanceToday = await Get(ATTENDANCE, today)

    const checkInData = children.map((childData) => {
      const cardData = {
        id: childData.id,
        firstName: childData.firstName,
        lastName: childData.lastName,
        uri: childData.uri,
        checkIn: attendanceToday.attendance[childData.id].checkIn,
        checkOut: attendanceToday.attendance[childData.id].checkOut,
      }

      return cardData
    })

    setCheckInData(checkInData)
  }


  const toggleCheckIn = async (id) => {
    const today = GetShortDate()
    const attendanceToday = await Get(ATTENDANCE, today)
    attendanceToday.attendance[id].checkIn = !attendanceToday.attendance[id].checkIn

    await Update(ATTENDANCE, today, attendanceToday)

    getCheckInData()
  }


  const getAttendanceCards = () => {
    if (!checkInData) {
      return null
    }

    return (
      checkInData.map((data, i) => {
        return (
          <AttendanceCard
            key={i}
            data={data}
            selected={data.checkIn}
            onPress={() => toggleCheckIn(data.id)}
          />
        )
      })
    )
  }


  const getCurrentAttendance = () => {
    let total = 0

    checkInData.forEach((data) => {
      if (data.checkIn) {
        total += 1
      }
    })

    return total
  }


  const getAttendanceTotals = () => {
    const currentAttendance = getCurrentAttendance()

    if (currentAttendance === checkInData.length) {
      return 'All children are here'
    } else if (currentAttendance === 1) {
      return '1 child is here'
    } else {
      return `${currentAttendance} children are here`
    }
  }


  const toggleHelpAudio = async () => {
    try {
      if (soundObject) {
        await soundObject.stopAsync()

        setSoundObject(null)
      } else {
        const soundObject = new Audio.Sound()
        await soundObject.loadAsync(require('../assets/audio/attendance.mp3'))
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

      <Text style={[Styles.h1, Styles.raleway]}>
        Check In
      </Text>

      <Text style={Styles.h2}>
        { GetFullDate() }
      </Text>

      <Text style={[Styles.text, { marginLeft: 10, marginBottom: 20 }]} >
        { checkInData ? getAttendanceTotals() : null }
      </Text>

      <ScrollView contentContainerStyle={Styles.attendanceHolder} >
        { checkInData ? getAttendanceCards() : null }
      </ScrollView>

      <TouchableOpacity
        style={Styles.helpButton}
        onPress={toggleHelpAudio}
      >
        <View style={Styles.helpButtonIcon} >
          <Icon name="record-voice-over" color="#3c233d" size={36} />
        </View>
      </TouchableOpacity>
    </Backdrop>
  )
}

export default CheckIn
