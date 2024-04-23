import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

import colors from './colors';

import { useDebouncedValue } from '../../utils/debounce';

export default function DebouncedInput({editable = true, placeholder, multiline, style, update, value}) {  
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
        editable={editable}
        onChangeText={updateState}
        placeholder={placeholder || 'Type Here'}
        placeholderTextColor={{}}
        multiline={multiline}
        style={{
          backgroundColor: colors.lightWhite,
          flex: 1,
          fontFamily: 'Inter-Regular',
          ...style,
        }}
        value={text}
      />
  );
};
