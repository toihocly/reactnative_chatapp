import React from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import USER from '../Utils/User';
import firebase from 'firebase';
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentDidMount() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyB-Vrv5gaVIPRZuSFO8lN_hpvTJi0yoxto',
      authDomain: 'fir-chatapp-ecb59.firebaseapp.com',
      databaseURL: 'https://fir-chatapp-ecb59.firebaseio.com',
      projectId: 'fir-chatapp-ecb59',
      storageBucket: '',
      messagingSenderId: '219904720132',
      appId: '1:219904720132:web:b9e5188d3138d889',
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    USER.phone = await AsyncStorage.getItem('userPhone');
    USER.name = await AsyncStorage.getItem('userName');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(USER.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
