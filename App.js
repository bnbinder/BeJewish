import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const BeRealCopy = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [friendPhotos, setFriendPhotos] = useState([]);

  // Function to submit a photo
  const submitPhoto = (photo) => {
    setPhotos([...photos, photo]);
  }

  // Function to select a photo from the user's photos
  const selectPhoto = (photo) => {
    setSelectedPhoto(photo);
  }

  // Function to fetch and display friend photos
  const displayFriendPhotos = () => {
    // Use some badass algorithm here to fetch friend photos
    setFriendPhotos([...friendPhotos, ...fetchedPhotos]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Be Real Copy</Text>

      {/* Component to submit a photo */}
      <TouchableOpacity style={styles.button} onPress={() => submitPhoto(photo)}>
        <Text style={styles.buttonText}>Submit a photo</Text>
      </TouchableOpacity>

      {/* Component to view user's photos */}
      <ScrollView horizontal={true}>
        {photos.map((photo, index) => (
          <TouchableOpacity key={index} onPress={() => selectPhoto(photo)}>
            <Image source={{ uri: photo }} style={styles.photo} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Component to view selected photo */}
      {selectedPhoto && (
        <View style={styles.selectedPhotoContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.selectedPhoto} />
        </View>
      )}

      {/* Component to view friend photos */}
      <ScrollView horizontal={true}>
        {friendPhotos.map((photo, index) => (
          <TouchableOpacity key={index}>
            <Image source={{ uri: photo }} style={styles.photo} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Component to fetch friend photos */}
      <TouchableOpacity style={styles.button} onPress={() => displayFriendPhotos()}>
        <Text style={styles.buttonText}>View friend photos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
  },
  selectedPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  selectedPhoto: {
    width: 300,
    height: 300,
    },
    });
    
    export default BeRealCopy;