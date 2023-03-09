import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, PermissionsAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setHasCameraPermission(false);
        setHasGalleryPermission(false);
        console.log('Sorry, this will not work on Sketch in an Android emulator. Try it on your device!');
        return;
      }
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      setImage(uri);
    }
  };

  const pickImage = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!cancelled) {
      setImage(uri);
    }
  };

  const submitPhoto = () => {
    if (image) {
      setGalleryImages([...galleryImages, image]);
      setImage(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {hasCameraPermission ? (
          <>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.camera}
              type={Camera.Constants.Type.front}
              ratio="4:3"
              pictureSize="Medium"
            />
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>No access to camera</Text>
        )}
      </View>
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image from Gallery</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>My Photos</Text>
        <View style={styles.gallery}>
          {galleryImages.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.galleryImage} />
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={submitPhoto}>
          <Text style={styles.buttonText}>Submit Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.friendsGalleryContainer}>
        <Text style={styles.galleryTitle}>My Friends' Photos</Text>
        <View style={styles.gallery}>
          <Image source={require('./dummy1.jpg')} style={styles.galleryImage} />
          <Image source={require('./dummy2.jpg')} style
={styles.galleryImage} />
<Image source={require('./dummy3.jpg')} style={styles.galleryImage} />
</View>
</View>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'space-between',
paddingTop: 50,
paddingBottom: 30,
},
cameraContainer: {
flex: 1,
width: '100%',
height: '50%',
backgroundColor: '#000',
justifyContent: 'flex-end',
alignItems: 'center',
},
camera: {
width: '100%',
height: '100%',
},
cameraButton: {
backgroundColor: '#fff',
padding: 10,
borderRadius: 5,
margin: 20,
},
buttonText: {
fontSize: 20,
},
imageContainer: {
width: '100%',
height: '30%',
alignItems: 'center',
},
image: {
width: '100%',
height: '100%',
resizeMode: 'contain',
},
galleryButton: {
backgroundColor: '#fff',
padding: 10,
borderRadius: 5,
margin: 20,
},
galleryContainer: {
width: '100%',
height: '20%',
alignItems: 'center',
},
galleryTitle: {
fontSize: 20,
marginBottom: 10,
},
gallery: {
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent: 'center',
alignItems: 'center',
},
galleryImage: {
width: 100,
height: 100,
margin: 5,
borderRadius: 5,
},
submitButton: {
backgroundColor: '#fff',
padding: 10,
borderRadius: 5,
marginTop: 20,
},
friendsGalleryContainer: {
width: '100%',
height: '20%',
alignItems: 'center',
},
});