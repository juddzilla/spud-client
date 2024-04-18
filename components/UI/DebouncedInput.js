import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

import colors from './colors';

import { useDebouncedValue } from '../../utils/debounce';

export default function DebouncedInput({placeholder, multiline, style, update, value}) {  
  const [text, setText] = useState(value);
  const debouncedInput = useDebouncedValue(text, 500);  

  useEffect(() => {
    setText(value);
  }, [value])


  useEffect(() => {
    if (value !== text) {
      update(text);        
    }
  }, [debouncedInput]);

  function updateState(input) {    
    setText(input);
  }

  return (
    <TextInput
        style={{
          backgroundColor: colors.lightWhite,
          flex: 1,
          fontFamily: 'Inter-Regular',
          ...style,
        }}
        onChangeText={updateState}
        value={text}
        placeholder={placeholder || 'Type Here'}
        editable={true}
        multiline={multiline}
      />
  );
};
