import * as SecureStore from 'expo-secure-store';
import React from 'react';

function useAsyncState(initialValue = [true, null]) {
  return React.useReducer(
    (state, action = null) => [false, action],
    initialValue
  );
}

export async function setStorageItemAsync(key, value) {
    if (value == null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
}

export function useStorageState(key) {
  const [state, setState] = useAsyncState();

  React.useEffect(() => {
    SecureStore.getItemAsync(key).then(value => {
        setState(value);
      });
  }, [key]);

  const setValue = React.useCallback(
    (value) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
