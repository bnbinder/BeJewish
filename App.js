import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground,
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
  const [chevruta, setChevruta] = useState(false);

  let sourceeImage = require("./dummy5.jpg");
  const randomPrompt = [
    "Donate to SOVA",
    "Study Torah",
    "Wrap Tfillin",
    "Celebrate Shabbat",
    "Welcome In Shabbat",
    "Celebrate Havdalah",
  ];
  const [prompt, setPrompt] = useState("Wrap Tfillin");
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
          title="Chevrutim"
          onPress={() => navigation.navigate("Friends")}
        ></Button>
        <Button
          title="About Us"
          onPress={() => navigation.navigate("About Us")}
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
      <View>
        <Button
          title="Reset Submit Photo"
          style={styles.submitButton}
          onPress={() => {
            resetSubmitPhoto();
          }}
        ></Button>
        <Button
          title="Random Prompt"
          style={styles.submitButton}
          onPress={() => {
            setRandomPrompt();
          }}
        ></Button>
        <Button
          title="Friday Prompt"
          style={styles.submitButton}
          onPress={() => {
            setPrompt("Welcome In Shabbat");
          }}
        ></Button>
        <Button
          title="Saturday Prompt"
          style={styles.submitButton}
          onPress={() => {
            setPrompt("Celebrate Shabbat");
          }}
        ></Button>
        <Button
          title="Sunday Prompt"
          style={styles.submitButton}
          onPress={() => {
            setPrompt("Celebrate Havdalah");
          }}
        ></Button>
      </View>
    );
  };

  const FriendsScreen = ({ navigation, route }) => {
    return (
      <View style={{ marginBottom: 60 }}>
        <ScrollView>
          <View>
            <Text style={styles.ChevrutimTitle}>CHEVRUTIM LIST</Text>
            <Text style={styles.Chevrutim}>Seth</Text>
            <Text style={styles.Chevrutim}>Eitan</Text>
            <Text style={styles.Chevrutim}>Coby</Text>
            <Text style={styles.Chevrutim}>Shmooly</Text>
            <Text style={styles.Chevrutim}>Mooly</Text>
            {chevruta ? (
              <Text style={styles.Chevrutim}>Buff Rabbi</Text>
            ) : (
              <View></View>
            )}
          </View>
          <View>
            {!chevruta ? (
              <View>
                <Text style={styles.ChevrutimTitle}>POTENTIAL CHEVRUTIM</Text>
                <Button
                  title="Buff Rabbi"
                  style={styles.Chevrutim}
                  onPress={chevrutaBuffToggle}
                ></Button>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const AboutUsScreen = () => {
    return <View></View>;
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

  const chevrutaBuffToggle = () => {
    setChevruta(true);
  };

  const setRandomPrompt = () => {
    let rando = Math.floor(Math.random() * 3);

    while (randomPrompt[rando] == prompt) {
      rando = Math.floor(Math.random() * 3);
      console.log(rando);
    }
    setPrompt(randomPrompt[rando]);
    console.log(prompt);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setHasCameraPermission(false);
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

  const submitPhoto = () => {
    console.log(prompt);
    if (image) {
      togglePlaceHolderPhotoVisibility();
      setGalleryImages([...galleryImages, image]);
      setImage(null);
    }
  };

  return (
    <NavigationContainer style={styles.home}>
      <View style={styles.container}>
        <ImageBackground
          source={require("./back.jpg")}
          style={styles.background}
        >
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
                title={!isPlaceHolderPhotoVisible ? prompt : "Kol Hakavod!"}
                onPress={() => {
                  takePictureREAL();
                }}
              ></Button>
            </View>
            <TouchableOpacity onPress={toggleIsSubmitPhotoFullScreen}>
              <View
                style={
                  !isSubmitPhotoScreen
                    ? styles.imageContainer
                    : image
                    ? fullScreenStyle
                    : styles.imageContainer
                }
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : isPlaceHolderPhotoVisible ? (
                  <Image
                    source={require("./dummy6.jpg")}
                    style={styles.image}
                  ></Image>
                ) : (
                  <Image
                    source={require("./dummy7.jpg")}
                    style={styles.image}
                  ></Image>
                )}
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={styles.cameraButton}>
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
                    {chevruta == true ? (
                      <Image
                        source={require("./dummy8.jpg")}
                        style={styles.galleryFriendImage}
                      />
                    ) : null}
                  </View>
                </ScrollView>
              </View>
            </View>
            {!isDevVisible ? (
              <View style={styles.galleryTitle}>
                <Button
                  title={isDevVisible ? "Hide" : "Menu"}
                  onPress={toggleDevVisibility}
                />
              </View>
            ) : (
              <View></View>
            )}
          </ScrollView>
        </ImageBackground>
      </View>

      {isDevVisible && (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="About Us" component={AboutUsScreen} />
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
    height: 200,
    alignItems: "center",
    marginBottom: 20,
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
    backgroundColor: "red",
    justifyContent: "flex-end",
    fontColor: "white",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignSelf: "center",
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
  },
  friendsGalleryContainer: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: 300,
    alignItems: "center",
    marginTop: 20,
  },
  ChevrutimTitle: {
    fontSize: 30,
    marginTop: 40,
    justifyContent: "flex-end",
    fontColor: "white",

    borderRadius: 5,
    margin: 20,
    alignSelf: "center",
  },
  Chevrutim: {
    fontSize: 20,
    justifyContent: "flex-end",
    fontColor: "white",
    alignItems: "center",
    borderRadius: 5,
    margin: 10,
    alignSelf: "center",
  },
});
