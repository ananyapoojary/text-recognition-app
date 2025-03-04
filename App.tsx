import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Clipboard from '@react-native-clipboard/clipboard'; // ✅ Only this import
import textRecognition from '@react-native-ml-kit/text-recognition';

const App = () => {
    const [text, setText] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);

    const handleImage = async (fromCamera: boolean) => {
        const options = { mediaType: 'photo' as const };

        const result = fromCamera ? await launchCamera(options) : await launchImageLibrary(options);

        if (result.assets && !result.didCancel) {
            const uri = result.assets[0]?.uri ?? null;
            setImage(uri);

            if (uri) {
                const recognitionResult = await textRecognition.recognize(uri);
                setText(recognitionResult.text || 'No text detected');
            } else {
                setText('No image selected');
            }
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
