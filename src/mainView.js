import React, { Fragment, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import { style, colors } from './style';
import { View, Pressable, FlatList,
    Text, StyleSheet, Modal } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { CenteredMessage, DateSelector } from './components'

const DaySelector = ({date, setDate, onPress}) => {
  const handleDaySwitch = (isNext) => {
    let off = isNext ? 1 : -1
    off *= 24 * 60 * 60 * 1000
    const newDate = new Date(date.getTime() + off)
    setDate(newDate)
  }
  return <DateSelector
    onPrev={() => handleDaySwitch(false)}
    onNext={() => handleDaySwitch(true)}
    onPress={onPress}>
    {date.toUTCString().slice(0, 11)}
  </DateSelector>
}


const HabitStatusButtons = ({habit, editHabitStatus}) => {
  const style = StyleSheet.create({
    habitButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      left: -10,
    },
    habitButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 7,
      marginHorizontal: 5,
    },
  })
  
  let jsx = []
  for (let type of [["checkmark", "isDone"], ["close", "isMissed"]]) {
    const color = habit[type[1]]
      ? colors.primary
      : colors.light;
    
    const handlePress = () => {
      const newHabit = habit.copy()
      newHabit.isDone = newHabit.isMissed =  false
      newHabit[type[1]] = !habit[type[1]]
      editHabitStatus(newHabit)
    }

    const name = `${type[0]}-outline`
    jsx.push(
      <Pressable onPress={handlePress} key={type[0]}
      style={[style.habitButton, {backgroundColor: color}]}>
        <Icon name={name} color={"#fff"} size={24}/>
      </Pressable>
    )
  }

  return <View style={style.habitButtons}>{jsx}</View>
}

const HabitElement = ({habit, enterEditView, editHabitStatus}) => {
  const st = StyleSheet.create({
    habitElement: {
      // borderTopWidth: 1,
      // borderBottomWidth: 1,
      borderColor: colors.light,
      marginVertical: 5,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }
  })
  
  return <View style={st.habitElement}>
    <HabitStatusButtons habit={habit} editHabitStatus={editHabitStatus}/>
    <Pressable onPress={() => enterEditView(habit.id)}>
      <Text style={[style.h3, style.right]}>{habit.title}</Text>
      <Text style={[style.p, style.right]}>{habit.description}</Text>
    </Pressable>
  </View>
}

const SeparatingLine = () => {
  return <View style={{
    flex: 1,
    height: 1,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderColor: colors.dark,
  }}></View>
}

const HabitList = ({habits, editHabitStatus, enterEditView}) => {
    if (habits.length == 0)
        return <CenteredMessage>No habit has been created</CenteredMessage>

    const st = StyleSheet.create({
      view: {
        borderColor: colors.dark,
        borderTopWidth: 1,
      }
    })
    const renderer = ({item: habit, index}) => <Fragment>
        <HabitElement id={habit.id} habit={habit}
        enterEditView={enterEditView}
        editHabitStatus={editHabitStatus}/>
        {index === habits.length-1 && <SeparatingLine/>}
    </Fragment>
    return <FlatList
      style={[style.appFrame, st.view]} 
      data={habits} 
      renderItem={renderer}
      ItemSeparatorComponent={SeparatingLine}
      />
}

const ActionButton = ({onPress, iconName}) => {
    const st = StyleSheet.create({
      press: {
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 50,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center"
      },
    })
  
    return <Pressable style={st.press} onPress={onPress}>
      <Icon name={iconName} color={"#fff"} size={24}/>
    </Pressable>
}

const ActionButtons = ({addHabit, showStats}) => {
  const st = StyleSheet.create({
    view: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      height: 110,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  })

  return <View style={st.view}>
    <ActionButton onPress={addHabit} iconName='add-outline'/>
    <ActionButton onPress={showStats} iconName='stats-chart'/>
  </View>
}

const MainView = ({
    habits,
    addHabit,
    enterEditView,
    enterStatView,
    editHabitStatus,
    date,
    setDate,
}) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
    return (
  <Fragment>
    <Modal
      visible={isCalendarVisible}
      transparent={true}
      onRequestClose={() => {setIsCalendarVisible(false)}}>
    <DateTimePicker
        mode="date"
        display="calendar"
        value={date}
        onChange={(e, newDate) => {setDate(newDate); setIsCalendarVisible(false)}}
    /></Modal>
    <DaySelector date={date} setDate={setDate} onPress={()=>setIsCalendarVisible(true)}/>
    {habits === null &&
        <CenteredMessage>Loading...</CenteredMessage>}
    {habits !== null &&
        <HabitList
        habits={habits}
        enterEditView={enterEditView}
        editHabitStatus={editHabitStatus}/>}
    <ActionButtons addHabit={addHabit} showStats={enterStatView}/>
  </Fragment>
  )
}

export default MainView