import { Slider } from '@miblanchard/react-native-slider';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';

interface IAudioSlider {
  songLink: string;
  sliderIcon: JSX.Element;
}

const dir = RNFetchBlob.fs.dirs.MusicDir;
RNFS.mkdir(`${dir}/Music`); //create directory to store music
const AudioSlider: React.FC<IAudioSlider> = props => {
  const [songName, setSongName] = useState<string | null>(null);
  const [songState, setSongState] = useState<{
    downloading: number;
    volume: number;
    instance: Sound | null;
  }>({
    downloading: 0,
    volume: 0,
    instance: null,
  });

  //   const setAudioInstance = async () => {

  //     if (audioPlayer instanceof Sound) {
  //       setSongState(prev => {
  //         return { ...prev, instance: audioPlayer };
  //       });
  //       return true;
  //     }
  //     return false;
  //   };

  const playSong = async () => {
    console.log('PLAYING ==>', songName);
    let audioInstance: Sound | null = null;
    if (!songState.instance) {
      audioInstance = await new Promise((resolve, reject) => {
        //load song
        const audio = new Sound(songName, dir, error => {
          if (error) {
            console.log('UNABLE TO LOAD AUDIO FILE!', songName);
            reject(null);
          }
          resolve(audio);
        });
      });
      setSongState(prev => {
        return {
          ...prev,
          instance: audioInstance,
        };
      });
    } else {
      audioInstance = songState.instance;
    }
    if (!audioInstance) {
      return;
    }

    audioInstance.setVolume(1);
    await new Promise((resolve, reject) => {
      if (audioInstance) {
        const song = audioInstance.play(finishedPlaying => {
          if (finishedPlaying) {
            console.log('SONG FINISHED!', songName);
            songState.instance?.reset();
            resolve(true);
            return;
          }
          console.log('UNABLE TO PLAY SONG!', songName);
          reject(false);
        });
        if (song) {
          console.log('PLAY', song);
          setSongState(prev => {
            return { ...prev, volume: 1 };
          });
        }
      }
    });
  };

  const startDownload = async () => {
    if (songState.instance) {
      return;
    }
    const songDownloadLink = props.songLink;
    const fileExists = await RNFS.exists(dir + `/${songName}`);
    console.log('FILE EXISTS', fileExists);

    //If sound is there in fileExplorer
    if (fileExists) {
      await playSong();

      return;
    }

    const updateProgress = (total: number, download: number) => {
      const percentage = (download / total) * 100;
      console.log('percentage', percentage);
      setSongState(prev => {
        return {
          ...prev,
          downloading: percentage,
        };
      });
    };

    const downloadData = RNFS.downloadFile({
      fromUrl: songDownloadLink,
      toFile: `${dir}/${songName}`,
      progressInterval: 100,
      progressDivider: 10,
      begin: () => console.log('PLAYING'),
      progress: res => updateProgress(res.contentLength, res.bytesWritten),
    });
    const downloadResult = await downloadData.promise;
    console.log('DOWNLOAD RESULT', downloadResult);

    if (downloadResult.statusCode === 200) {
      await playSong();
    }
    return downloadResult;
  };

  useEffect(() => {
    setSongName(props.songLink.split('=')[1]);
  }, [props.songLink]);

  return (
    <Slider
      maximumValue={1}
      minimumValue={0}
      minimumTrackTintColor={'rgba(0,0,0,0)'}
      maximumTrackTintColor={'rgba(0,0,0,0)'}
      value={songState.volume}
      onValueChange={async value => {
        if (songState.instance) {
          songState.instance.setVolume(
            Array.isArray(value) ? value[value.length - 1] : value,
          );
        } else {
          await startDownload();
        }
      }}
      trackStyle={style.trackStyle}
      containerStyle={style.sliderContainer}
      renderThumbComponent={() => (
        <View style={style.thumbStyle}>{props.sliderIcon}</View>
      )}
      vertical={true}
    />
  );
};

const style = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    height: '100%',
  },
  thumbStyle: {
    alignItems: 'center',
    padding: '10%',
    borderRadius: hp('10%'),
    backgroundColor: 'red',
    height: wp('12%'),
    justifyContent: 'center',
    width: hp('6%'),
  },
  trackStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 4,
    height: wp('12%'),
  },
});

export { AudioSlider };
