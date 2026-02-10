import InputDialog from '@/components/input-dialogs/category-input-dialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomHeader from '@/components/elements/custom-header';
import { useCategories } from '@/context/category-context';

import ColorPicker from '@/components/elements/color-picker';
import { Keyword } from '@/types/models';
import { FlashList } from '@shopify/flash-list';
import { twMerge } from 'tailwind-merge';

const CategoryKeywords = () => {
    const { id } = useLocalSearchParams();
    const isDarkMode = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets(); // used so that I can use manual extra padding to the flatlist so that it does not hide under the tabbar

    const { categories, setCategories } = useCategories();
    const getThisCategory = () => {
      return categories.filter(c => c.id === id)[0];
    }
    
    const [editMode, setEditMode] = useState(false);
    const [addKeywordModalVisible, setAddKeywordModalVisible] = useState(false);

    const addKeyword = (value : string) => {
        if(!value.trim()) return;
        const prevThisCategory = getThisCategory();
        const newThisCategory = {...prevThisCategory, keywords : [...prevThisCategory.keywords, { id: Date.now().toString(), word: value.trim() } ]};
        setCategories(prev => prev.map(c => (c.id === id ? newThisCategory : c)));
      }

    const changeColor = (color : string) => {
      const prevThisCategory = getThisCategory();
        const newThisCategory = {...prevThisCategory, color: color};
        setCategories(prev => prev.map(c => (c.id === id ? newThisCategory : c)));
    }

    const removeKeyword = (keywordId : string) => {
        const prevThisCategory = getThisCategory();
        const newThisCategory = {...prevThisCategory,keywords: prevThisCategory.keywords.filter(k => k.id !== keywordId) };
        setCategories(prev => prev.map(c => (c.id === id ? newThisCategory : c)));
    }

    const renderItem = ({ item }: { item: Keyword }) => (
    <View
      className={className.item}
      style={{backgroundColor: getThisCategory().color ?? (isDarkMode ? colors.dark.content.accent : colors.light.content.accent)}}
    >
      <Text className={className.text.item}>{item.word}</Text>
      {editMode && (
        <View className="flex-row">
        <TouchableOpacity onPress={() => removeKeyword(item.id)} className={className.button.icon}>
          <IconSymbol size={28} name="delete" color={isDarkMode ? colors.dark.content.negative : colors.light.content.negative} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

    return (
    <>
    <Stack.Screen options={{title: `${getThisCategory().name}`}}/>
    <View className={className.container} style={{paddingBottom: insets.bottom}}> 
      <CustomHeader name="Category keywords">
        <TouchableOpacity className={className.button.secondary}
          onPress = {() => setAddKeywordModalVisible(true)}>
            <Text className="px-5 text-5xl text-center text-light-content-primary dark:text-dark-content-primary">
              {"+"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className={className.button.secondary} onPress={() => setEditMode(!editMode)}>
            <Text className="px-5 text-xl text-light-content-primary dark:text-dark-content-primary">
              {editMode ? <IconSymbol size={28} name="done" color={ isDarkMode ? colors.dark.content.primary : colors.light.content.primary}/> : <IconSymbol size={28} name="edit" color={ isDarkMode ? colors.dark.content.primary : colors.light.content.primary} />}
            </Text>
          </TouchableOpacity>
      </CustomHeader>

      <View className="mb-5">
        <Text className={twMerge(className.text.heading3,"mb-1")}>Colour</Text>
      <ColorPicker
       selectedColor={getThisCategory().color} 
       onSelectColor={(color) => changeColor(color)}/>
      </View>

      <Text className={twMerge(className.text.heading3,"mb-1")}>Keywords</Text>
      <Text className={twMerge(className.text.footnote,"mb-2")}>If a transaction's category is set to "automatic", the transaction will automatically be scanned for these keywords</Text>
      
      <FlashList
        data={getThisCategory().keywords}
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