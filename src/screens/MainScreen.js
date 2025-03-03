import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { recognizeText } from '@react-native-ml-kit/text-recognition';

export default function MainScreen() {
  const [text, setText] = useState('');

  const handleTextRecognition = async () => {
    const result = await recognizeText({});
    setText(result.text);
  };

  return (
    <View>
      <Button title="Scan Text" onPress={handleTextRecognition} />
      <Text>{text}</Text>
    </View>
  );
}
