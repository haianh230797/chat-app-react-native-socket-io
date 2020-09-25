import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {
  GiftedChat,
  Actions,
  Composer,
  Send,
  InputToolbar,
} from 'react-native-gifted-chat';
import {Icon} from 'native-base';
import io from 'socket.io-client';
import ImagePicker from 'react-native-image-picker';

const App = () => {
  const [listChat, setListChat] = useState([
    {
      _id: 2,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
      image:
        'https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI',
    },
  ]);

  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setName(Math.random() * 100);
  }, []);
  let socket = io('http://10.10.10.78:3000');

  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    onSocket();
  }, [onSocket]);

  const onSocket = useCallback(() => {
    socket.on('chat message', (msg) => {
      setListChat([...msg, ...listChat]);
    });
  }, [listChat, socket]);
  useEffect(() => {
    text.length !== 0 ? setIsTyping(true) : setIsTyping(false);
    socket.emit('is typing', isTyping);
  }, [isTyping, socket, text.length]);

  const onSend = useCallback(
    (messages = []) => {
      messages[0].user._id = name;
      messages[0].user.name = name;
      messages[0].user.avatar = 'https://placeimg.com/140/140/any';
      socket.emit('chat message', messages);
      setListChat(GiftedChat.append(listChat, messages));
    },
    [listChat, name, socket],
  );
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.containerToolbar}
      primaryStyle={{alignItems: 'center'}}
    />
  );

  const pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: 'data:image/png;base64,' + response.data};
        let messContent = [
          {
            _id: Math.random() * 10000000000000000000000000000000,
            createdAt: new Date(),
            user: {
              _id: name,
              name: name,
              avatar: 'https://placeimg.com/140/140/any',
            },
            image: source.uri,
          },
        ];
        socket.emit('chat message', messContent);
        setListChat(GiftedChat.append(listChat, messContent));
      }
    });
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={styles.actionContainer}
      icon={() => (
        <Icon name="options" type="SimpleLineIcons" style={{color: 'white'}} />
      )}
      onSend={(args) => console.log('args' + args)}
      options={{
        'Choose From Library': () => {
          pickImage();
        },
        Cancel: () => {
          console.log('Cancel');
        },
      }}
      optionTintColor="#222B45"
    />
  );

  const renderComposer = (props) => (
    <Composer {...props} textInputStyle={styles.textInputBox} />
  );

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={styles.containerSend}>
      <Icon name="send" type="Feather" style={{color: 'white'}} />
    </Send>
  );

  return (
    <GiftedChat
      messages={listChat}
      onSend={(messages) => onSend(messages)}
      text={text}
      onInputTextChanged={setText}
      user={{
        _id: name,
        name: name,
        avatar:
          'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/00/0099abd07f1b902116d31787057581546314475c_full.jpg',
      }}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderAvatarOnTop={true}
      isTyping={true}
    />
  );
};
export default App;
const styles = StyleSheet.create({
  actionContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 0,
  },
  containerToolbar: {
    backgroundColor: '#222B45',
    paddingTop: 6,
  },
  textInputBox: {
    color: '#222B45',
    backgroundColor: '#EDF1F7',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E4E9F2',
    paddingTop: 8.5,
    paddingHorizontal: 12,
    marginLeft: 0,
  },
  containerSend: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});
