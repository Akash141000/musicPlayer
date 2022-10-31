import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { CloseIcon } from '../assets/icons/CloseIcon';

const MainHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.closeIconContainer}>
        <CloseIcon />
      </View>
      <Text style={styles.textStyle}>Instructions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '10%',
    paddingHorizontal: '2%',
    paddingTop: '1%',
  },
  textStyle: {
    color: 'white',
    fontSize: hp('2%'),
    fontWeight: '600',
  },
  closeIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('10%'),
    height: hp('5%'),
    borderRadius: wp('3%'),
    margin: 0,
    padding: 0,
  },
});

export { MainHeader };
