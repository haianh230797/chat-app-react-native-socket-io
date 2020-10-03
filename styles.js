import {StyleSheet} from 'react-native';

const themeStyles = StyleSheet.create({
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
    backgroundColor: '#FFF',
    paddingTop: 6,
  },
  textInputBox: {
    color: '#222B45',
    backgroundColor: '#EDF1F7',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E4E9F2',
    paddingTop: 8.5,
    paddingHorizontal: 12,
    marginLeft: 0,
    marginRight: 10,
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
  bubleBox: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '50%',
    marginVertical: 2,
  },
  bubleContent: {},
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    marginHorizontal: 8,
    fontSize: 20,
    color: '#646DE8',
  },
});

export default themeStyles;
