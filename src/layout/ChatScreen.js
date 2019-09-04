import React from 'react';

import {
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import styless from '../constants/styless';
import USER from '../Utils/User';
import firebase from 'firebase';
import {GiftedChat} from 'react-native-gifted-chat';

class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
      messageList: [],
    };
  }

  async componentDidMount() {
    const key_primary = await this.compareKey(
      USER.phone,
      this.state.person.phone,
    );
    firebase
      .database()
      .ref('messages')
      .child(key_primary)
      .on('child_added', value => {
        this.setState(perValue => ({
          messageList: [value.val(), ...perValue.messageList],
        }));
      });
  }

  async componentWillUnmount() {
    const key_primary = await this.compareKey(
      USER.phone,
      this.state.person.phone,
    );
    const Rdb = firebase
      .database()
      .ref('messages')
      .child(key_primary);
    Rdb.off();
  }

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(USER.phone)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: USER.phone,
      };
      updates[
        'messages/' + USER.phone + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.person.phone + '/' + USER.phone + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf: item.from === USER.phone ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === USER.phone ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {item.time}
        </Text>
      </View>
    );
  };

  // gọi firebase check xem khóa chung giữ 2 số điện thoại đã được tạo ra hay chưa
  checkChildKeyExist = async value => {
    return await firebase
      .database()
      .ref(`messages/${value}`)
      .once('value')
      .then(snapshot => {
        return snapshot.exists();
      });
  };

  compareKey = async (fristKey, secondKey) => {
    const key1 = `${fristKey}-${secondKey}`;
    const key2 = `${secondKey}-${fristKey}`;
    const existKey1 = await this.checkChildKeyExist(key1);
    const existKey2 = await this.checkChildKeyExist(key2);
    if (existKey1) return key1;
    else if (existKey2) return key2;
    else return key1;
  };

  onSend = async (messages = []) => {
    try {
      if (messages[0].text.length > 0) {
        const key_primary = await this.compareKey(
          USER.phone,
          this.state.person.phone,
        );
        let msgId = firebase
          .database()
          .ref('messages')
          .child(key_primary)
          .push().key;
        let updates = {};
        updates['messages/' + key_primary + '/' + msgId] = messages[0];

        firebase
          .database()
          .ref()
          .update(updates);
      }
    } catch (error) {
      console.warn(' error :', error);
    }
  };

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messageList}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: USER.phone,
          }}
        />
        {/* <FlatList
          style={{
            padding: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#eee',
          }}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'auto',
          }}>
          <TextInput
            style={[styless.input, {marginBottom: 0}]}
            onChangeText={text => {
              this.setState({textMessage: text});
            }}
            value={this.state.textMessage}
            placeholder="Type message..."
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={[styless.buttonText, {marginLeft: 3}]}>Send</Text>
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    );
  }
}

export default ChatScreen;
