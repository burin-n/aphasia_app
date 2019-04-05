import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json
const config = require('../config.json');


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Word Selection',
  };

  constructor(props){
    super(props);
    if(props.navStack){
      console.log(props.navStack)
    }
  }
  
  // _onWordPressed = (name,index) => {
  //   console.log(name,index)
  //   this.props.navigation.navigate('Recording')
  // }

  render () {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={config['targetWords']}
          keyExtractor = { (item, index) => item.name}
          renderItem={({item, index}) => { 
            return (
                <TouchableHighlight
                  style={styles.button}
                  underlayColor='#6babf9'
                  onPress={() => this.props.navigation.navigate('Record', item )}
                >
                  <Text> {item.word} </Text>
                </TouchableHighlight>
              )
            }
          }
        />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 10
//   },

//   countContainer: {
//     alignItems: 'center',
//     padding: 10
//   },
//   countText: {
//     color: '#FF00FF'
//   }
// })