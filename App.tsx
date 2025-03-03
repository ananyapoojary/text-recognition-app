import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import textRecognition from '@react-native-ml-kit/text-recognition';

const App = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const selectImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (!result.didCancel && result.assets) {
            const uri = result.assets[0].uri;
            setImage(uri);

            // Perform text recognition
            const recognitionResult = await textRecognition.recognize(uri);
            setText(recognitionResult.text);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Select Image" onPress={selectImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Text>{text}</Text>
        </View>
    );
};

export default App;
