import { Slider } from '@miblanchard/react-native-slider';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNFS from 'react-native-fs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Sound from 'react-native-sound';

interface IAudioSlider {
  songLink: string;
  sliderIcon: JSX.Element;
}

const dir =
  Platform.OS === 'android'
    ? RNFS.ExternalDirectoryPath
    : RNFS.DocumentDirectoryPath;
RNFS.mkdir(`${dir}/Music`); //create directory to store music
const AudioSlider: React.FC<IAudioSlider> = props => {
  const [songState, setSongState] = useState<{
    downloading: number;
    volume: number;
    instance: Sound | null;
  }>({
    downloading: 0,
    volume: 0,
    instance: null,
  });

  const playSong = async () => {
    const fileName = props.songLink.split('=')[1];
    let audioInstance: Sound | null = null;

    if (!songState.instance) {
      audioInstance = await new Promise((resolve, reject) => {
        //load song
        const audio = new Sound(fileName, dir, error => {
          if (error) {
            console.log('UNABLE TO LOAD AUDIO FILE!', fileName);
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

    await new Promise((resolve, reject) => {
      if (audioInstance) {
        const song = audioInstance.play(finishedPlaying => {
          if (finishedPlaying) {
            console.log('SONG FINISHED!', fileName);
            songState.instance?.reset();
            resolve(true);
            return;
          }
          console.log('UNABLE TO PLAY SONG!', fileName);
          reject(false);
        });
        if (song) {
          audioInstance.setVolume(0.5);
          handleVolume(0.5);
        }
      }
    });
  };

  const startDownload = async () => {
    if (songState.instance) {
      return;
    }
    const songDownloadLink = props.songLink;
    const fileName = props.songLink.split('=')[1];
    console.log('FILE NAME', fileName);

    const fileExists = await RNFS.exists(dir + `/${fileName}`);
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
      toFile: `${dir}/${fileName}`,
      progressInterval: 100,
      progressDivider: 10,
      progress: res => updateProgress(res.contentLength, res.bytesWritten),
    });
    const downloadResult = await downloadData.promise;
    console.log('DOWNLOAD RESULT', downloadResult);

    if (downloadResult.statusCode === 200) {
      await playSong();
    }
    return downloadResult;
  };

  const handleVolume = (volume: number) => {
    setSongState(prev => {
      return {
        ...prev,
        volume: volume,
      };
    });
  };

  useEffect(() => {
    startDownload();
  }, []);

  return (
    <Slider
      disabled={
        songState.downloading !== 100 && !songState.instance ? true : false
      }
      maximumValue={1}
      minimumValue={0}
      minimumTrackTintColor={'rgba(0,0,0,0)'}
      maximumTrackTintColor={'rgba(0,0,0,0)'}
      value={songState.volume}
      onSlidingStart={() => {
        if (
          songState.instance &&
          !songState.instance.isPlaying() &&
          songState.volume === 0
        ) {
          console.log('PLAYING');
          playSong();
          // songState.instance.setVolume(0.5);
        }
      }}
      onValueChange={value => {
        const volume = Array.isArray(value) ? value[value.length - 1] : value;
        if (songState.instance) {
          console.log('IS PLAYING', songState.instance.isPlaying(), volume);

          if (volume === 0) {
            songState.instance.pause();
          }
          if (!songState.instance.isPlaying() && volume > 0) {
            playSong();
          }
          songState.instance.setVolume(volume);
          handleVolume(volume);
        }
      }}
      trackStyle={style.trackStyle}
      containerStyle={style.sliderContainer}
      renderThumbComponent={() => (
        <AnimatedCircularProgress
          fill={
            songState.downloading < 100 && !songState.instance
              ? songState.downloading
              : 100
          }
          size={wp('14%')}
          width={wp('1%')}
          tintColor="white"
        >
          {() => (
            <View
              style={{
                ...style.thumbStyle,
                ...(songState.volume > 0 && songState.instance?.isPlaying()
                  ? { backgroundColor: 'white' }
                  : {}),
                transform: [{ rotate: '90deg' }],
              }}
            >
              {props.sliderIcon}
            </View>
          )}
        </AnimatedCircularProgress>
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
    borderRadius: hp('5%'),
    height: wp('12%'),
    justifyContent: 'center',
    width: hp('7%'),
  },
  trackStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 4,
    height: wp('12%'),
  },
});

export { AudioSlider };
