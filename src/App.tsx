import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Main } from './screens/Main';

const App = () => {
  return (
    <SafeAreaView style={style.safeAreaStyle}>
      <Main />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
});

export default App;
