/* eslint-disable prettier/prettier */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {
  GiftedChat,
  Actions,
  Composer,
  Send,
  InputToolbar,
  Bubble,
} from 'react-native-gifted-chat';
import {Icon} from 'native-base';
import io from 'socket.io-client';
import ImagePicker from 'react-native-image-picker';
import Fire from './Fire';
import themeStyle from './styles';
import NetInfo from '@react-native-community/netinfo';

let socket = io('http://10.10.10.172:3000');

const App = () => {
  const [listChat, setListChat] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionID, setSessionID] = useState();

  const [isNetwork, setIsNetwork] = useState(true);

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
  // check subcire network để set xem có pending không tránh re-render

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setIsNetwork(false);
      } else {
        setIsNetwork(true);
      }
    });
  }, []);

  useEffect(() => {
    var socketConnection = io.connect();
    socketConnection.on('connect', function () {
      setSessionID(socketConnection.socket.sessionid);
    });
  });

  console.log('sessionID: ', socket.id);

  useEffect(() => {
    socket.on('getData', (msg) => {
      let arr = msg.map(
        ([
          {
            _id: idValue,
            createdAt: createdAtValue,
            text: textValue,
            user: userValue,
          },
        ]) => ({
          _id: idValue,
          createdAt: createdAtValue,
          text: textValue,
          user: userValue,
        }),
      );
      setListChat(arr);
    });
    return () => {
      socket.off('getData');
    };
  }, []);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setListChat([msg[0], ...listChat]);
    });
    return () => {
      socket.off('chat message');
    };
  }, [listChat]);
  useEffect(() => {
    socket.on('chat image', (msg) => {
      setListChat([msg[0], ...listChat]);
    });
    return () => {
      socket.off('chat image');
    };
  }, [listChat]);

  useEffect(() => {
    if (text !== '') {
      let Info = {
        typing: true,
        user: name,
      };
      socket.emit('typing', Info);
    } else {
      let Info = {
        typing: false,
        user: name,
      };
      socket.emit('typing', Info);
    }
  }, [name, text]);

  useEffect(() => {
    socket.on('typing', (msg) => {
      msg.user !== name ? setTyping(msg.typing) : setTyping(false);
    });
    return () => {
      socket.off('typing');
    };
  }, [listChat, name]);

  const onSendMess = (messages) => {
    if (isNetwork === false) {
      setListChat([
        ...listChat,
        [
          {
            _id: messages[0].user.name,
            createdAt: messages[0].createdAt,
            text: messages[0].text,
            user: messages[0].user,
            pending: true,
          },
        ],
      ]);
    } else {
      onSend(messages);
    }
  };

  const onSend = (messages) => {
    messages[0].user._id = name;
    messages[0].user.name = name;
    messages[0].user.avatar = 'https://placeimg.com/140/140/any';
    socket.emit('chat message', messages);
  };

  const sendLike = () => {
    let messContent = [
      {
        _id: Math.random() * 10000000000000000000000000000000,
        text: '👍',
        createdAt: new Date(),
        user: {
          _id: name,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ];
    socket.emit('chat message', messContent);
  };
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.containerToolbar}
      primaryStyle={{alignItems: 'center'}}
    />
  );
  const takeImage = () => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
      } else if (response.customButton) {
        console.log('User tapped custom button ');
      } else {
        if (response.type === 'image/jpeg') {
          Fire.shared
            .uploadPhotoAsync(response.uri)
            .then((data) => {
              let messContent = [
                {
                  _id: Math.random() * 10000000000000000000000000000000,
                  createdAt: new Date(),
                  user: {
                    _id: name,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                  image: data,
                },
              ];
              socket.emit('chat image', messContent);
            })
            .catch((err) => {
              console.log('err  ', err);
            });
        } else if (response.type === 'video/mp4') {
          Fire.shared
            .uploadPhotoAsync(response.uri)
            .then((data) => {
              let messContent = [
                {
                  _id: Math.random() * 10000000000000000000000000000000,
                  createdAt: new Date(),
                  user: {
                    _id: name,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                  video: data,
                },
              ];
              socket.emit('chat image', messContent);
            })
            .catch((err) => {
              console.log('err  ', err);
            });
        } else {
          return;
        }
      }
    });
  };
  const pickImage = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
      } else if (response.customButton) {
        console.log('User tapped custom button: ');
      } else {
        if (response.type === 'image/jpeg') {
          Fire.shared
            .uploadPhotoAsync(response.uri)
            .then((data) => {
              let messContent = [
                {
                  _id: Math.random() * 10000000000000000000000000000000,
                  createdAt: new Date(),
                  user: {
                    _id: name,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                  image: data,
                },
              ];
              socket.emit('chat image', messContent);
            })
            .catch((err) => {
              console.log('err  ', err);
            });
        } else if (response.type === 'video/mp4') {
          Fire.shared
            .uploadPhotoAsync(response.uri)
            .then((data) => {
              let messContent = [
                {
                  _id: Math.random() * 10000000000000000000000000000000,
                  createdAt: new Date(),
                  user: {
                    _id: name,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                  video: data,
                },
              ];
              socket.emit('chat image', messContent);
            })
            .catch((err) => {
              console.log('err  ', err);
            });
        } else {
          return;
        }
      }
    });
  };
  const ActionItem = ({names, types, funcs}) => {
    return (
      <TouchableOpacity onPress={funcs}>
        <Icon name={names} type={types} style={styles.actionItem} />
      </TouchableOpacity>
    );
  };
  const renderActions = (props) => {
    return (
      <View style={styles.actionBox}>
        <ActionItem names={'options'} types={'SimpleLineIcons'} />
        <ActionItem names={'camera'} types={'Entypo'} funcs={takeImage} />
        <ActionItem
          names={'picture-o'}
          types={'FontAwesome'}
          funcs={pickImage}
        />
      </View>
    );
  };

  // const renderMessageVideo = (props) => {
  //   return (
  //     <View style={{padding: 5}}>
  //       <Video
  //         resizeMode="contain"
  //         useNativeControls
  //         shouldPlay={true}
  //         source={{uri: currentMessage.video}}
  //         style={{height: 150, width: 200, borderRadius: 10}}
  //       />
  //     </View>
  //   );
  // };
  const renderComposer = (props) => (
    <Composer {...props} textInputStyle={styles.textInputBox} />
  );
  const renderSend = (props) =>
    text !== '' ? (
      <Send
        containerStyle={styles.containerSend}
        {...props}
        disabled={!props.text}>
        <Icon
          name="md-send-sharp"
          type="Ionicons"
          style={{color: '#646DE8', marginRight: 15, bottom: 8}}
        />
      </Send>
    ) : (
      <TouchableOpacity
        onPress={sendLike}
        containerStyle={styles.containerLike}>
        <Icon
          name="like1"
          type="AntDesign"
          style={{color: '#646DE8', marginRight: 15}}
        />
      </TouchableOpacity>
    );

  const renderBubble = (props) => {
    return (
      <View style={styles.bubbleContainer}>
        <Icon name="warning" type="AntDesign" style={styles.offlineWarning} />
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: 'black',
            },
          }}
        />
      </View>
    );
  };
  return (
    <React.Fragment>
      <GiftedChat
        messages={listChat}
        onSend={onSendMess}
        text={text}
        onInputTextChanged={(texts) => setText(texts)}
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
        // renderMessageVideo={renderMessageVideo}
        renderUsernameOnMessage={true}
        isTyping={typing}
        placeholder={'Aa'}
        renderBubble={renderBubble}
      />
    </React.Fragment>
  );
};
export default App;
const styles = StyleSheet.create({
  ...themeStyle,
});
