import React, {Component} from 'react';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import styless from '../constants/styless';
import USER from '../Utils/User';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    name: USER.name,
  };

  __logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert('Error', 'Please enter valid name');
    } else if (this.state.name !== USER.name) {
      firebase
        .database()
        .ref('users')
        .child(USER.phone)
        .remove();
      firebase
        .database()
        .ref('users')
        .child(USER.phone)
        .set({name: this.state.name});
      USER.name = this.state.name;
      await AsyncStorage.setItem('userName', this.state.name);
      this.setState({name: this.state.name});
      Alert.alert('Success', 'Name changed successful.');
    }
  };

  render() {
    return (
      <SafeAreaView style={styless.container}>
        <Text style={{fontSize: 20}}>{USER.phone}</Text>
        <Text style={{fontSize: 20}}>{USER.name}</Text>
        <TextInput
          style={styless.input}
          value={this.state.name}
          onChangeText={text => this.setState({name: text})}
        />
        <TouchableOpacity onPress={this.changeName}>
          <Text style={styless.buttonText}>Change Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 15}} onPress={this.__logOut}>
          <Text style={[styless.buttonText, {color: '#F44336'}]}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default ProfileScreen;
