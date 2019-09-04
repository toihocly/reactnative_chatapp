import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import USER from '../Utils/User';
// import AsyncStorage from '@react-native-community/async-storage';
import styless from '../constants/styless';
import firebase from 'firebase';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Chats',
      headerRight: (
        <TouchableOpacity
          style={{marginRight: 5}}
          onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assest/images/user.png')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    users: [],
  };

  componentDidMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.phone = val.key;
      const index = this.state.users.findIndex(i => i.phone === person.phone);
      if (index > -1) {
        const newArray = [...this.state.users];
        newArray[index].name = person.name;
        this.setState({users: newArray});
      } else {
        if (person.phone !== USER.phone)
          this.setState(prevState => ({
            users: [...prevState.users, person],
          }));
      }
    });
  }
  componentWillUnmount() {
    let dbRef = firebase.database().ref('users');
    dbRef.off();
  }

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderWidth: 1}}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView>
        {this.state.users === [] ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.phone}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
