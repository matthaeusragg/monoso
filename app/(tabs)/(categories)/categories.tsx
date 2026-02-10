import CategoryInputDialog from '@/components/input-dialogs/category-input-dialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomHeader from '@/components/elements/custom-header';
import { useCategories } from '@/context/category-context';
import { Category } from '@/types/models';

const CategoriesTab = () => {
  const router = useRouter();
  const colorScheme = useColorScheme(); // this is only necessary since I need this variable for the IconSymbol
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets(); // used so that I can use manual extra padding to the flatlist so that it does not hide under the tabbar

  const { categories, setCategories, addCategory, removeCategory } = useCategories();
  const [editMode, setEditMode] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);

  const renderItem = ({ item, drag, isActive }: { item: Category, drag : any, isActive : any }) => (
    <TouchableOpacity
      className={className.item}
      style={{ backgroundColor: item.color ?? (isDarkMode ? colors.dark.content.accent : colors.light.content.accent) }}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <Text className={className.text.item}>{item.name}</Text>
      {editMode && (
        <View className="flex-row">
          <Pressable onLongPress={drag} delayLongPress={0} className={className.button.icon}>
        <IconSymbol size={28} name="reorder" color={isActive ? (isDarkMode ? colors.dark.content.tertiary : colors.light.content.tertiary) : (isDarkMode ? colors.dark.surface.sunken : colors.light.surface.sunken)} />
        </Pressable>
        <TouchableOpacity onPress={() => removeCategory(item.id)} className={className.button.icon}>
          <IconSymbol size={28} name="delete" color={isDarkMode ? colors.dark.content.negative : colors.light.content.negative} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={className.container} style={{paddingBottom: insets.bottom + 25}}> 
    {/* manual extra padding for tabbar */}
      <CustomHeader name="Categories">
        <TouchableOpacity className={className.button.secondary}
          onPress = {() => setAddCategoryModalVisible(true)}>
          <Text className="px-5 text-5xl text-center text-light-content-primary dark:text-dark-content-primary">
            {"+"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className={className.button.secondary} 
        onPress={() => setEditMode(!editMode)}>
          <Text className="px-5 text-xl ">
            {editMode ? <IconSymbol size={28} name="done" color={ isDarkMode ? colors.dark.content.primary : colors.light.content.primary}/> : <IconSymbol size={28} name="edit" color={ isDarkMode ? colors.dark.content.primary : colors.light.content.primary} />}
          </Text>
        </TouchableOpacity>
      </CustomHeader>

      <DraggableFlatList
        data={categories}
        onDragEnd={({ data }) => setCategories(data)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        className="rounded-2xl"
      />
      <CategoryInputDialog visible={addCategoryModalVisible}
      title="Add Category"
      onCancel = {() => setAddCategoryModalVisible(false)}
      onSubmit = {(value : string, color : string) => {
        addCategory({ id : Date.now().toString(), name: value.trim(), color : color, keywords: [] });
        setAddCategoryModalVisible(false)
      }}
      showColorPicker = {true}>
      </CategoryInputDialog>
    </SafeAreaView>
  );
}

export default CategoriesTab;

// const className = classNameheet.create({
//   container: { flex: 1, padding: 16 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
//   title: { fontSize: 24, fontWeight: 'bold' },
//   item: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 , backgroundColor: 'yellow'},
//   itemText: { fontSize: 18 },
//   delete: { color: 'red', marginLeft: 12 },
//   addRow: { flexDirection: 'row', marginBottom: 12 },
//   input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 8 }
// });

// const styleClasses = {
//   container: "flex-1 p-4",
//   header: "flex-row justify-between mb-4",
//   title: "text-2xl font-bold",
//   item: "flex-row justify-between p-3 border-b bg-light-item dark:bg-dark-item",
//   itemText: "text-lg text-light-content-onAccent dark:text-dark-content-onAccent",
//   delete: "text-red-500 ml-3",
//   addRow: "flex-row mb-3",
//   input: "flex-1 border p-2 mr-2"
// };
