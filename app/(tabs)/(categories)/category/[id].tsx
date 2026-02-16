import InputDialog from '@/components/input-dialogs/category-input-dialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomHeader from '@/components/elements/custom-header';
import { useCategories } from '@/context/category-context';

import ColorPicker from '@/components/elements/color-picker';
import { isDeepEqual } from '@/functions/handling';
import { Category, Keyword } from '@/types/models';
import { FlashList } from '@shopify/flash-list';
import { twMerge } from 'tailwind-merge';

const CategoryKeywords = () => {
    const { id } = useLocalSearchParams();
    const colorSchemeKey = useColorScheme() === 'dark' ? 'dark' : 'light';
    const insets = useSafeAreaInsets(); // used so that I can use manual extra padding to the flatlist so that it does not hide under the tabbar

    const { categories, setCategories } = useCategories();
    const getThisCategory = () => {
      return categories.filter(c => c.id === id)[0];
    }
    const [ localCategory, setLocalCategory] = useState<Category>(getThisCategory());
    
    const [addKeywordModalVisible, setAddKeywordModalVisible] = useState(false);
    const hasChanges = useMemo(() => !isDeepEqual(localCategory, getThisCategory()), [localCategory, categories]);

    const addKeyword = (value : string) => {
        if(!value.trim()) return;
        setLocalCategory(prev => ({...prev, keywords : [...prev.keywords, { id: Date.now().toString(), word: value.trim() } ]}));
      }

    const changeColor = (color : string) => {
        setLocalCategory(prev => ({...prev, color: color}));
    }

    const removeKeyword = (keywordId : string) => {
        setLocalCategory(prev => ({...prev,keywords: prev.keywords.filter(k => k.id !== keywordId) }));
    }

    const saveToGlobalCategories = () => {
      setCategories(prev => prev.map(c => (c.id === id ? localCategory : c)));
    }

    const renderItem = ({ item }: { item: Keyword }) => (
    <View
      className={className.item}
      style={{backgroundColor: localCategory.color ?? (colors[colorSchemeKey].content.accent)}}
    >
      <Text className={className.text.item}>{item.word}</Text>
      <View className="flex-row">
        <TouchableOpacity onPress={() => removeKeyword(item.id)} className={className.button.icon}>
          <IconSymbol size={28} name="delete" color={colors[colorSchemeKey].content.negative} />
        </TouchableOpacity>
      </View>
    </View>
  );

    return (
    <>
    <Stack.Screen options={{title: `${localCategory.name}`}}/>
    <View className={className.container} style={{paddingBottom: insets.bottom}}> 
      <CustomHeader name="Category keywords">
          { hasChanges && (<TouchableOpacity className={hasChanges ? className.button.primary : className.button.secondary} onPress={() => {if(hasChanges) saveToGlobalCategories()}}>
            <Text className="px-4 py-2 text-xl text-light-content-primary dark:text-dark-content-primary">
              { <IconSymbol size={28} name="done" color={ hasChanges ? colors[colorSchemeKey].content.onAccent : colors[colorSchemeKey].content.primary}/> }
            </Text>
          </TouchableOpacity>)}
      </CustomHeader>

      <View className="mb-5">
        <Text className={twMerge(className.text.heading3,"mb-1")}>Colour</Text>
      <ColorPicker
       selectedColor={localCategory.color} 
       onSelectColor={(color) => changeColor(color)}/>
      </View>

      <View className={twMerge(className.header, "mb-1")}>
        <Text className={twMerge(className.text.heading3,"mb-1")}>Keywords</Text>
        <View className="flex-row mb-1">
          <TouchableOpacity className={className.button.secondary}
            onPress = {() => setAddKeywordModalVisible(true)}>
              <Text className="px-5 text-5xl text-center text-light-content-primary dark:text-dark-content-primary">
                {"+"}
              </Text>
            </TouchableOpacity>
          </View>
      </View>
      <Text className={twMerge(className.text.footnote,"mb-2")}>If a transaction's category is set to "automatic", the transaction will automatically be scanned for these keywords</Text>
      
      <FlashList
        data={localCategory.keywords}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        className="rounded-2xl"
      />
      
      <InputDialog visible={addKeywordModalVisible}
      title="Add Keyword"
      onCancel = {() => setAddKeywordModalVisible(false)}
      onSubmit = {async (value : string) => {
        addKeyword(value);
        setAddKeywordModalVisible(false)
      }}>
      </InputDialog>
    </View>
    </>
  );
}


export default CategoryKeywords;