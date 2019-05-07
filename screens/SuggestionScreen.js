import React from 'react';
import {StyleSheet, ScrollView, WebView} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';

export default class SuggestionScreen extends React.Component {
    static navigationOptions = {
      title: 'Suggestion',
    };
  
    render() {
      return (
            <WebView
                style={styles.container}
                javaScriptEnabled={true}
                source={{
                    uri: 'https://www.youtube.com/embed/inNe8h2H_7E',
                }}
            />
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
  });
  