import React from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import USER from '../Utils/User';
import styless from '../constants/styless';
import firebase from 'firebase';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    phone: '',
    name: '',
    blockInput: true,
  };

  // componentWillMount(){
  //   AsyncStorage.getItem("userPhone").then(val=>{
  //     if(val){
  //       this.setState({phone:val})
  //     }
  //   })
  // }

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('Error', 'Wrong phone number');
    } else if (this.state.name < 1) {
      Alert.alert('Error', 'Wrong name');
    } else {
      firebase
        .database()
        .ref('users/' + this.state.phone + '/name')
        .once('value')
        .then(async snapshot => {
          if (snapshot.val() && snapshot.val() !== this.state.name) {
            Alert.alert('Error', 'name is wrong');
            return;
          }
          await AsyncStorage.setItem('userPhone', this.state.phone);
          await AsyncStorage.setItem('userName', this.state.name);
          USER.phone = this.state.phone;
          USER.name = this.state.name;

          firebase
            .database()
            .ref('users/' + USER.phone)
            .set({name: this.state.name});
          this.props.navigation.navigate('App');
        });
    }
  };

  onQuerryExistPhone = () => {
    firebase
      .database()
      .ref('users/' + this.state.phone + '/name')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.setState({name: snapshot.val(), blockInput: false});
        } else {
          if (!this.state.blockInput) {
            this.setState({blockInput: true});
          }
          if (this.state.name !== '') {
            this.setState({name: ''});
          }
        }
      });
  };

  render() {
    return (
      <View style={styless.container}>
        <Image
          style={{marginBottom: 15}}
          source={require('../assest/images/TitleLogo.png')}
        />
        <TextInput
          style={styless.input}
          keyboardType="number-pad"
          onChangeText={text => {
            this.setState({phone: text});
          }}
          onSubmitEditing={this.onQuerryExistPhone}
          value={this.state.phone}
          placeholder="Phone number"
        />
        <TextInput
          style={styless.input}
          editable={this.state.blockInput}
          onChangeText={text => {
            this.setState({name: text});
          }}
          value={this.state.name}
          placeholder="Name"
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styless.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;
