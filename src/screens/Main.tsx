import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { AudioControl } from '../assets/icons/AudioControllerIcon';
import { AudioSlider } from '../components/AudioSlider';

//Download Links for songs
const filesDownloadLink = [
  'https://cdn.pixabay.com/download/audio/2021/10/26/audio_4f8a79b6f6.mp3?filename=deep-ambient-version-60s-9889.mp3',
  'https://cdn.pixabay.com/download/audio/2021/10/26/audio_0979fa832a.mp3?filename=ukulele-trip-version-60s-9893.mp3',
];

//Create music directory
// const dir = RNFetchBlob.fs.dirs.MusicDir;
// // RNFS.mkdir(`${dir}/Music`); //create directory to store music

const Main = () => {
  return (
    <ImageBackground
      source={require('../assets/backgroundImages/MainScreenBackground.png')}
    >
      <View style={style.mainContainer}>
        <View style={style.headerContainer}>
          <Text>Close</Text>
        </View>
        <View style={style.audioControlContainer}>
          {filesDownloadLink.map((song, index) => (
            <AudioSlider
              sliderIcon={<AudioControl />}
              songLink={song}
              key={index}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    width: wp('100%'),
    height: hp('100%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerContainer: {
    display: 'flex',
    color: 'red',
  },
  audioControlContainer: {
    height: hp('30%'),
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: hp('10%'),
  },
});

export { Main };
