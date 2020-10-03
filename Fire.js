import FirebaseKeys from './config';
import firebase from 'firebase';

class Fire {
  constructor() {
    firebase.initializeApp(FirebaseKeys);
  }
  uploadVideoAsync = async (uri) => {
    const path = `videos/${Math.random() * 100000000}/${Date.now()}.mp4`;
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);

      upload.on(
        'state_changed',
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        },
      );
    });
  };

  uploadPhotoAsync = async (uri) => {
    const path = `photos/${Math.random() * 100000000}/${Date.now()}.jpg`;
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);

      upload.on(
        'state_changed',
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        },
      );
    });
  };

  get firestore() {
    return firebase.firestore();
  }
  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
