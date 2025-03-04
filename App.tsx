import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import textRecognition from '@react-native-ml-kit/text-recognition';
import ImagePicker from 'react-native-image-crop-picker';

const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera Permission",
                message: "This app needs access to your camera",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

const App = () => {
    const [text, setText] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);

    const handleImage = async (fromCamera: boolean) => {
        try {
            if (fromCamera) {
                const permissionGranted = await requestCameraPermission();
                if (!permissionGranted) {
                    ToastAndroid.show('Camera permission denied', ToastAndroid.SHORT);
                    return;
                }

                const result = await ImagePicker.openCamera({
                    cropping: true,
                    freeStyleCropEnabled: true,
                    mediaType: 'photo',
                });

                if (result?.path) {
                    setImage(result.path);

                    // Perform text recognition
                    const recognitionResult = await textRecognition.recognize(result.path);
                    setText(recognitionResult.text || 'No text detected');
                }
            } else {
                const result = await ImagePicker.openPicker({
                    cropping: true,
                    freeStyleCropEnabled: true,
                    mediaType: 'photo',
                });

                if (result?.path) {
                    setImage(result.path);

                    // Perform text recognition
                    const recognitionResult = await textRecognition.recognize(result.path);
                    setText(recognitionResult.text || 'No text detected');
                }
            }
        } catch (error) {
            console.log('Image selection error:', error);
            ToastAndroid.show('Image selection canceled', ToastAndroid.SHORT);
        }
    };

    const copyToClipboard = () => {
        if (text) {
            Clipboard.setString(text);
            ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('No text to copy!', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={() => handleImage(false)} style={styles.button}>
                    Select from Gallery
                </Button>
                <Button mode="contained" onPress={() => handleImage(true)} style={styles.button}>
                    Open Camera
                </Button>
            </View>

            {image && (
                <Card style={styles.card}>
                    <Card.Cover source={{ uri: image }} style={styles.image} />
                    <Card.Content>
                        <Text style={styles.textTitle}>Recognized Text:</Text>
                        <Text style={styles.text}>{text}</Text>
                        <Button mode="contained" onPress={copyToClipboard} style={styles.copyButton}>
                            Copy to Clipboard
                        </Button>
                    </Card.Content>
                </Card>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: '#4CAF50',
    },
    card: {
        width: '90%',
        borderRadius: 10,
        elevation: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
    },
    copyButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
    },
});

export default App;
