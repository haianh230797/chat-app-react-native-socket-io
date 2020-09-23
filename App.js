import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {FlatList, TextInput, Platform} from 'react-native';
import {
  GiftedChat,
  Actions,
  Composer,
  Send,
  InputToolbar,
  ActionsProps,
} from 'react-native-gifted-chat';
import {Icon} from 'native-base';
import io from 'socket.io-client';
import ImagePicker from 'react-native-image-picker';

const App = () => {
  const [listChat, setListChat] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState();
  let socket = io('http://10.10.10.53:3000');
  console.log(image ? 'image src : ' + image : 'no data');

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

  const onSend = useCallback(
    (messages = []) => {
      socket.emit('chat message', messages);
      setListChat(GiftedChat.append(listChat, messages));
    },
    [listChat, socket],
  );
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#222B45',
        paddingTop: 6,
      }}
      primaryStyle={{alignItems: 'center'}}
    />
  );
  const pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', Object.keys(response));

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setImage({
          avatarSource: source.avatarSource,
        });
      }
    });
    // const ImageMess = {
    //   _id: Math.random() * 1000000000000000000000000000000,
    //   createdAt: '2020-09-23T04:39:06.039Z',
    //   text: image,
    //   user: {_id: 1},
    // };
    // socket.emit('chat message', ImageMess);
    // setListChat(GiftedChat.append(listChat, ImageMess));
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
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
    <Composer
      {...props}
      textInputStyle={{
        color: '#222B45',
        backgroundColor: '#EDF1F7',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E4E9F2',
        paddingTop: 8.5,
        paddingHorizontal: 12,
        marginLeft: 0,
      }}
    />
  );

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
      }}>
      <Icon name="send" type="Feather" style={{color: 'white'}} />
    </Send>
  );

  return (
    <React.Fragment>
      {/* {image && <Image source={image.avatarSource} style={{height:100}}/>} */}
      <GiftedChat
        messages={listChat}
        onSend={(messages) => onSend(messages)}
        text={text}
        onInputTextChanged={setText}
        user={{
          _id: 1,
        }}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
      />
    </React.Fragment>
  );
};
export default App;
