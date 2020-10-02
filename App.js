/* eslint-disable prettier/prettier */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
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
import Video from 'react-native-video';

let socket = io('http://10.10.10.127:3000');

const App = () => {
  const [listChat, setListChat] = useState([]);

  const [text, setText] = useState('');
  const [name, setName] = useState('');
  if (!name) {
    setName(Math.random());
  }
  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    mediaType: 'mixed',
    videoQuality: 'low',
  };
  useEffect(() => {
    socket.emit('callData', '');
  }, []);

  useEffect(() => {
    socket.on('getData', (msg) => {
      setListChat(msg);
    });
  }, []);
  useEffect(() => {
    socket.on('chat message', (msg) => {
      setListChat([msg[0], ...listChat]);
    });
  }, [listChat]);

  const onSend = (messages) => {
    messages[0].user._id = name;
    messages[0].user.name = name;
    messages[0].user.avatar = 'https://placeimg.com/140/140/any';
    socket.emit('chat message', messages);
  };

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
        const sourceImg = {uri: 'data:image/png;base64,' + response.data};
        const sourceVid = {uri: 'data:video/mp4;base64,' + response.data};
        if (response.type === 'image/jpeg') {
          let messContent = [
            {
              _id: Math.random() * 10000000000000000000000000000000,
              createdAt: new Date(),
              user: {
                _id: name,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
              },
              image: sourceImg.uri,
            },
          ];
          socket.emit('chat message', messContent);
        } else if (response.type === 'video/mp4') {
          const type = 'video/mp4';
          const formData = new FormData();
          const uri = sourceVid.uri;
          formData.append('video', {
            name: 'mobile-video-upload',
            type,
            uri,
          });
        } else {
          return;
        }
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
      onSend={(args) => console.log('args')}
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

  const renderMessageVideo = (props) => {
    const {currentMessage} = props;
    return (
      <View style={{padding: 5}}>
        <Video
          resizeMode="contain"
          useNativeControls
          shouldPlay={true}
          source={{uri: currentMessage.video}}
          style={{height: 150, width: 200, borderRadius: 10}}
        />
      </View>
    );
  };
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
    <React.Fragment>
      <GiftedChat
        messages={listChat}
        onSend={onSend}
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
        renderMessageVideo={renderMessageVideo}
      />
    </React.Fragment>
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
  backgroundVideo: {
    height: 300,
  },
  videoBox: {
    height: 150,
    width: 250,
  },
  videoStyle: {
    left: 0,
    top: 0,
    height: 150,
    width: 250,
    borderRadius: 20,
  },
});
