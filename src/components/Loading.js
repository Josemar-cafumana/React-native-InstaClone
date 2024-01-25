import { View, ActivityIndicator, StyleSheet, Dimensions, Keyboard } from 'react-native'
import React from 'react'
import { useEffect } from 'react';

const Loading = () => {
    useEffect(() => {
        Keyboard.dismiss(); 
    }, []);
    
  return (
    <View style={styles.container}>
      <ActivityIndicator color={'#fff'} size={100}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,.6)'
    }
})

export default Loading