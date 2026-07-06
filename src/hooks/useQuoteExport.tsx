import { useCallback } from 'react';
import { Alert, Share } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { captureRef } from 'react-native-view-shot';

export type QuoteExportData = {
  text: string;
  author: string;
  source: string;
};

type ExportOptions = {
  cardRef: React.RefObject<any>;
  quote: QuoteExportData;
};

export default function useQuoteExport({
  cardRef,
  quote,
}: ExportOptions) {
  const captureCard = useCallback(async () => {
    if (!cardRef.current) {
      throw new Error('Quote card not available.');
    }

    const uri = await captureRef(cardRef.current, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    return uri;
  }, [cardRef]);

  const downloadQuote = useCallback(async () => {
    try {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      const { status } =
        await MediaLibrary.requestPermissionsAsync(true);

      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please allow access to your photos to save the quote.'
        );
        return;
      }

      const imageUri = await captureCard();

      await MediaLibrary.saveToLibraryAsync(imageUri);

      Alert.alert(
        'Saved',
        'Quote has been saved to your gallery.'
      );
    } catch (err) {
      console.error('Error saving quote image to library:', err);

      Alert.alert(
        'Error',
        'Unable to save the quote.'
      );
    }
  }, [captureCard]);

  const shareQuote = useCallback(async () => {
    try {
      Haptics.selectionAsync();

      const imageUri = await captureCard();

      const available =
        await Sharing.isAvailableAsync();

      if (available) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Quote',
        });
        return;
      }

      await Share.share({
        message: `${quote.text}\n\n— ${quote.author}`,
      });
    } catch (err) {
      console.log(err);
    }
  }, [captureCard, quote]);

  const copyQuote = useCallback(async () => {
    try {
      Haptics.selectionAsync();

      await Clipboard.setStringAsync(
        `${quote.text}

— ${quote.author}

${quote.source}`
      );

      Alert.alert(
        'Copied',
        'Quote copied to clipboard.'
      );
    } catch (err) {
      console.log(err);
    }
  }, [quote]);

  const favoriteQuote = useCallback(async () => {
    try {
      Haptics.selectionAsync();

      const folder =
        FileSystem.documentDirectory + 'favorites';

      const info =
        await FileSystem.getInfoAsync(folder);

      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(folder);
      }

      const filename =
        folder +
        '/' +
        Date.now() +
        '.json';

      await FileSystem.writeAsStringAsync(
        filename,
        JSON.stringify(quote, null, 2)
      );

      Alert.alert(
        'Added',
        'Quote added to favorites.'
      );
    } catch (err) {
      console.log(err);

      Alert.alert(
        'Error',
        'Unable to save favorite.'
      );
    }
  }, [quote]);

  return {
    captureCard,
    downloadQuote,
    shareQuote,
    copyQuote,
    favoriteQuote,
  };
}