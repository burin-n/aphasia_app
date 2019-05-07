import React from 'react';
import {StyleSheet, Text, View, Button, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
const config = require('../config.json');


export default class RecordScreen extends React.Component{
  static navigationOptions = {
    title: 'Recording',
  };

  constructor(props) {
    super(props);
    // this.backend_url = 'http://161.200.194.159:5000';
    // this.backend_url = 'http://35.198.200.19:5000';
    this.backend_url = config['backend'];
    this.recorder = null;
    this.recorderSettings = JSON.parse(JSON.stringify(RECORDING_OPTIONS_PRESET_HIGH_QUALITY));
    this.sound = null;
    
    const { navigation } = props;
    this.targetName = navigation.getParam('name', null);
    this.targetWord = navigation.getParam('word', null);


    this.state = {
      haveRecordPermission: false,
      buttonTitle: "Start",
      buttonState: 'Idle',
      isLoading : false,
      isRecording: false, 
    };

    
  }

  componentDidMount() {
    this._askForPermissions();
    
  }

  _askForPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
      Alert.alert('Hey! You might want to enable notifications for my app, they are good.');
    }
    else{
      // alert('Audio recording is allowed.')
    }
    this.setState({
      haveRecordPermission: status === 'granted'
    })
  }

  _onRecordPressed(){
    console.log(this.state.isRecording)
    if (this.state.isRecording) {
      this._stopRecording();    
    } else {
      this._startRecording();
    }
  };


  _updateScreenForRecordingStatus = status => {
    console.log(status)
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecording();
      }
    }
  };
  

  async _startRecording() {
    console.log('permission inside', this.state.haveRecordPermission)
    console.log('start recording...')

    this.setState({
      isLoading: true,
      
    });

    // if (this.sound !== null) {
    //   await this.sound.unloadAsync();
    //   this.sound.setOnPlaybackStatusUpdate(null);
    //   this.sound = null;
    // }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });

    if (this.recorder !== null) {
      this.recorder.setOnRecordingStatusUpdate(null);
      this.recorder = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recorderSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recorder = recording;
    try {
      await this.recorder.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    } catch (error){

    }

    this.setState({
      isLoading: false,
    });
    console.log('done prepare record')
  }


  async _stopRecording() {
    console.log('stop recoding...')
    this.setState({
      isLoading: true,
    });
    try {
      await this.recorder.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recorder.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false 
    });

    // const { sound, status } = await this.recorder.createNewLoadedSound(
    //   {
    //     isLooping: true,
    //     isMuted: this.state.muted,
    //     volume: this.state.volume,
    //     rate: this.state.rate,
    //     shouldCorrectPitch: this.state.shouldCorrectPitch,
    //   },
    //   this._updateScreenForSoundStatus
    // );
    // this.sound = sound;
    
    await this._fetch_feedback(info.uri);
  }
  

  async _fetch_feedback(path){
      // feedback = await this.fetch_feedback(result.path)
      // res_body = JSON.parse(feedback._bodyText)
      // this.setState({
      //   score : res_body
      // })
    console.log('fetching...', this.backend_url)
    // Send a POST request
    
    const file = {
      uri : path,
      name : path.split('/')[path.split('/').length-1],
      type : 'audio/m4a'
    }

    const body = new FormData()
    body.append('file', file)
    try{
      response = await fetch(`${this.backend_url}/upload?target=${this.targetName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
          body
      });
      
      feedback = JSON.parse(response._bodyText).score
      console.log(feedback)
      if(!response.ok) Alert.alert('','Server Error')
      else Alert.alert('Score',response._bodyText)
    } catch(error) {
      console.log(error)
      Alert.alert('','network error')
    }
    console.log('end..')
    FileSystem.deleteAsync(path)
    console.log(path + ' is deleted')
  
    this.setState({
      isLoading: false
    })
  }

  _getButtonStyle(){
    let style = Object.assign({}, styles.button)
    if(this.state.isLoading) style["backgroundColor"] = "#6d6d69"
    else if(this.state.isRecording) style["backgroundColor"] = buttonColorChoices["Record"]
    else style["backgroundColor"] = buttonColorChoices["Idle"] 

    console.log('style', style)
    return style
  }

  render() {
    return this.state.haveRecordPermission ? (
      <View style={styles.container}>

        <Text style={styles.welcome}>{this.targetWord}</Text>
        <Text style={styles.instructions}>{this.targetName}</Text>
        <TouchableOpacity
          style={this._getButtonStyle()}
          onPress={() => this._onRecordPressed()}
          disabled={this.state.isLoading} 
        >
          <Text style={styles.button_text}>{this.state.isRecording ? "หยุด" : "อัดเสียง"}</Text>
        </TouchableOpacity>
        {this.state.isLoading && <ActivityIndicator size="large" color="#737373" /> }
        
      </View>
    ) : (
      <View style={styles.container}>
        <Text>No Permission</Text> 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: "90%",
    height: "50%",
    borderRadius: 45,
  },
  button_text : {
    color : "#FFFFFF",
    fontSize : 30
  }
});

const buttonColorChoices = {
  'Record' : '#f45942', 
  'Idle' : '#1188c4'
}

export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
  },
  ios: {
      extension: '.m4a',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
  },
};