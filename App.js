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
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const HomeScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.cameraContainer}>
            {hasCameraPermission ? (
              <>
                <Camera
                  ref={setCamera(ref)}
                  style={styles.camera}
                  type={Camera.Constants.Type.front}
                  ratio="4:3"
                  pictureSize="Medium"
                />
              </>
            ) : (
              <Text>No access to camera</Text>
            )}
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
            <Text style={styles.buttonText}>Wrap Tefillin</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.galleryContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitPhoto}
              >
                <Text style={styles.buttonText}>Submit Photo</Text>
              </TouchableOpacity>
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
              <View style={styles.gallery}>
                <Image
                  source={require("./dummy1.jpg")}
                  style={styles.galleryImage}
                />
                <Image
                  source={require("./dummy2.jpg")}
                  style={styles.galleryImage}
                />
                <Image
                  source={require("./dummy3.jpg")}
                  style={styles.galleryImage}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  const ProfileScreen = ({ navigation, route }) => {
    return <Text>This is {route.params.name}'s profile</Text>;
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

  const takePicture = useCallback(async () => {
    if (camera != null) {
      const { uri } = await camera.takePictureAsync().catch((error) => {
        console.log(error);
      });
      setImage(uri);
    } else {
      console.log("camera is null");
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
      setGalleryImages([...galleryImages, image]);
      setImage(null);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
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
    height: "20%",
    alignItems: "center",
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
    width: 100,
    height: 100,
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
    height: 150,
    alignItems: "center",
    marginTop: 20,
  },
});
