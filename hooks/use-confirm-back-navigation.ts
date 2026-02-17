import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

/**
 * @param shouldPrevent - Boolean indicating if the back action should be intercepted
 * @param title - Alert title
 * @param message - Alert message
 */
export const useConfirmBackNavigation = (
  shouldPrevent: boolean,
  title = 'Discard changes?',
  message = 'You have unsaved changes. Are you sure you want to leave?'
) => {
    const navigation = useNavigation();
      useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          if (!shouldPrevent) {
            // If no changes, just let the navigation happen
            return;
          }
    
          // Prevent default behavior of leaving the screen
          e.preventDefault();
    
          // Prompt the user
          Alert.alert(
            title,
            message,
            [
              { text: "Cancel", style: 'cancel', onPress: () => {} },
              {
                text: 'Discard',
                style: 'destructive',
                // If they confirm, manually dispatch the action we prevented
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
        });
    
        return unsubscribe;
      }, [navigation, shouldPrevent, title, message]);
}