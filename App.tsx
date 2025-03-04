import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid, PermissionsAndroid, Platform, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import textRecognition from '@react-native-ml-kit/text-recognition';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

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
        <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appName}>Energy Meter OCR</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Extract Text from Images</Text>

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
                        <Image source={{ uri: image }} style={styles.image} />
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 15,
        backgroundColor: '#ffdde1',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        elevation: 5,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        backgroundColor: '#f799dd',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    card: {
        width: '90%',
        borderRadius: 0,
        elevation: 4,
        padding: 15,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 0,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    text: {
        fontSize: 14,
        marginTop: 5,
        color: '#666',
    },
    copyButton: {
        marginTop: 10,
        backgroundColor: '#759de0',
        borderRadius: 15,
    },
});

export default App;
