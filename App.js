import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDevVisible, setIsDevVisible] = useState(false);
  const [isCameraFullScreen, setIsCameraFullScreen] = useState(false);
  const [isSubmitPhotoScreen, setIsSubmitPhotoFullScreen] = useState(false);
  const [isPlaceHolderPhotoVisible, setIsPlaceHolderPhotoVisible] =
    useState(false);
  const length = galleryImages.length;
  const galleryImagesFullScreen = Array.from({ length }, () => false);

  const fullScreenStyle = {
    width: "100%",
    height: 650,
  };

  const HomeScreen = ({ navigation }) => {
    return (
      <View style={styles.home}>
        <Button
          title="Developer Settings"
          onPress={() => navigation.navigate("Profile")}
        ></Button>
        <Button
          title={isDevVisible ? "Hide" : "Show"}
          onPress={toggleDevVisibility}
        />
      </View>
    );
  };
  const ProfileScreen = ({ navigation, route }) => {
    return (
      <Button
        title="Reset Submit Photo"
        style={styles.submitButton}
        onPress={() => {
          resetSubmitPhoto();
        }}
      ></Button>
    );
  };

  const toggleDevVisibility = () => {
    setIsDevVisible(!isDevVisible);
  };

  const togglePlaceHolderPhotoVisibility = () => {
    if (!isPlaceHolderPhotoVisible) {
      setIsPlaceHolderPhotoVisible(!isPlaceHolderPhotoVisible);
    }
  };

  const resetSubmitPhoto = () => {
    setIsPlaceHolderPhotoVisible(false);
    setGalleryImages([]);
  };

  const toggleIsCameraFullScreen = () => {
    setIsSubmitPhotoFullScreen(false);
    setIsCameraFullScreen(!isCameraFullScreen);
  };

  const toggleIsSubmitPhotoFullScreen = () => {
    setIsCameraFullScreen(false);
    setIsSubmitPhotoFullScreen(!isSubmitPhotoScreen);
  };

  const toggleGalleryImagesFullScreen = (numba) => {
    galleryImagesFullScreen.fill(false);
    galleryImagesFullScreen[numba] = !galleryImagesFullScreen[numba];
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setHasCameraPermission(false);
        setHasGalleryPermission(false);
        console.log(
          "Sorry, this will not work on Sketch in an Android emulator. Try it on your device!"
        );
        return;
      }
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus === "granted");
    })();
  }, []);

  const takePictureREAL = () => {
    if (!isPlaceHolderPhotoVisible) takePicture();
  };

  const takePicture = useCallback(async () => {
    if (camera != null) {
      const { uri } = await camera.takePictureAsync().catch((error) => {
        console.log(error);
      });
      setImage(uri);
    } else {
      console.log("camera is: " + camera);
    }
  }, [camera]);

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
      togglePlaceHolderPhotoVisibility();
      setGalleryImages([...galleryImages, image]);
      setImage(null);
    }
  };

  return (
    <NavigationContainer style={styles.home}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity onPress={toggleIsCameraFullScreen}>
            <View
              style={
                !isCameraFullScreen ? styles.cameraContainer : fullScreenStyle
              }
            >
              {hasCameraPermission ? (
                <>
                  <Camera
                    ref={(ref) => setCamera(ref)}
                    style={styles.camera}
                    type={Camera.Constants.Type.front}
                    captureSize="Medium"
                    ratio="4:3"
                  />
                </>
              ) : (
                <Text>No access to camera</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.cameraButton}>
            <Button
              title={
                !isPlaceHolderPhotoVisible ? "Wrap Tfillin" : "Kol Hakavod!"
              }
              onPress={() => {
                takePictureREAL();
              }}
            ></Button>
          </View>
          <TouchableOpacity onPress={toggleIsSubmitPhotoFullScreen}>
            <View
              style={
                !isSubmitPhotoScreen ? styles.imageContainer : fullScreenStyle
              }
            >
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.galleryContainer}>
              <Button
                title={
                  !isPlaceHolderPhotoVisible
                    ? "Submit Photo"
                    : "Submitted Photo"
                }
                style={styles.submitButton}
                onPress={() => {
                  submitPhoto();
                }}
              ></Button>
              <View style={styles.gallery}>
                {galleryImages.map((uri) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={styles.galleryImage}
                  />
                ))}
              </View>
            </View>

            <View style={styles.friendsGalleryContainer}>
              <Text style={styles.galleryTitle}>My Friends' Photos</Text>
              <ScrollView style={{ flex: 1 }} horizontal>
                <View style={styles.gallery}>
                  <Image
                    source={require("./dummy1.jpg")}
                    style={styles.galleryFriendImage}
                  />
                  <Image
                    source={require("./dummy2.jpg")}
                    style={styles.galleryFriendImage}
                  />
                  <Image
                    source={require("./dummy3.jpg")}
                    style={styles.galleryFriendImage}
                  />
                  <Image
                    source={require("./dummy4.jpg")}
                    style={styles.galleryFriendImage}
                  />
                  <Image
                    source={require("./dummy5.jpg")}
                    style={styles.galleryFriendImage}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
          {!isDevVisible && (
            <Button
              title={isDevVisible ? "Hide" : "Show"}
              onPress={toggleDevVisibility}
            />
          )}
        </ScrollView>
      </View>
      {isDevVisible && (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 30,
  },
  cameraContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    backgroundColor: "red",
    justifyContent: "flex-end",
    fontColor: "white",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
  },
  imageContainer: {
    paddingTop: 30,
    width: "100%",
    height: 150,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  galleryButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  galleryContainer: {
    width: "100%",
    flex: 1,
    height: 60,
    alignItems: "center",
    marginBottom: 20,
    height: "20%",
  },
  galleryTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryImage: {
    width: 150,
    height: 200,
    borderRadius: 5,
  },
  galleryFriendImage: {
    width: 150,
    height: 200,
    margin: 5,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  friendsGalleryContainer: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: 300,
    alignItems: "center",
    marginTop: 20,
  },
});
