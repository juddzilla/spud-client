// https://fostermade.co/blog/making-speech-to-text-work-with-react-native-and-expo

import { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
 } from 'expo-av';

export default function Recorder({ submit }) {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    const recordingOptions = {
      // android not currently in use, but parameters are required
      android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
      },
      ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
      },
  };

    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: true,
    
      });

      
      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (sound) => { /* do something for ui */ }
        // sound.metering is the db -180 -> 0
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {    
    await endRecording();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);   
    submit(uri);
  }

  async function endRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );       
  }

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 10,
    },
  });

  return (
    <View
      style={styles.container} 
      // onStartShouldSetResponder={() => true} 
      // onTouchEnd={(e) => e.stopPropagation()}
    >
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      { recording &&
        <Button
            title='Cancel'
            onPress={endRecording}
        />
      }
    </View>
  );
}

