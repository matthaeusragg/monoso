import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { useMemo } from 'react';
import { View } from 'react-native';

interface Header {
  component: React.ReactNode;
  sticky?: boolean;
}

interface SectionListConfig<SectionT, ItemT> {
  sections: ReadonlyArray<SectionT & { data: ReadonlyArray<ItemT> }>;
  renderItem: (info: {
    item: ItemT;
    index: number;
    section: SectionT;
  }) => React.ReactElement | null;
  renderSectionHeader?: (info: {
    section: SectionT;
  }) => React.ReactElement | null;
  keyExtractor?: (item: ItemT, index: number) => string;
}

interface FlatListConfig<ItemT> {
  data: ReadonlyArray<ItemT>;
  header?: React.ReactNode;
  renderItem: (info: {
    item: ItemT;
    index: number;
  }) => React.ReactElement | null;
  keyExtractor?: (item: ItemT, index: number) => string;
}

export interface WrappedUnifiedListProps extends Omit<FlashListProps<any>, "data" | "renderItem" | "getItemType" | "keyExtractor" | "stickyHeaderIndices"> {
  headers?: Header[];
  sectionListConfig?: SectionListConfig<any, any>;
  flatListConfig?: FlatListConfig<any>;
  [key: string]: any;
}

/**
 * This component uses a Shopify flashlist to render
 * 1. headers
 * 2. then a section list
 * 3. and finally a flatlist
 * as one scrollable component.
 * 
 * EXAMPLE USAGE
<WrappedUnifiedList
  headers={[
    { component: <MyMainHeader />, sticky: false },
    { component: <MyFilterBar />, sticky: true }
  ]}
  sectionListConfig={{
    sections: mySections,
    renderSectionHeader: ({ section }) => <SectionHeader title={section.title} />,
    renderItem: ({ item }) => <ItemComponent item={item} />
  }}
  flatListConfig={{
    header: <FlatListHeader />,
    data: myFlatData,
    renderItem: ({ item }) => <FlatItemComponent item={item} />
  }}
/>
 * @param param0 
 * @returns 
 */
const WrappedUnifiedList: React.FC<WrappedUnifiedListProps> = ({
  headers = [],
  sectionListConfig,
  flatListConfig,
  ...flashListProps
}) => {
  const { data, stickyIndices } = useMemo(() => {
    const items: any[] = [];
    const sticky: number[] = [];
    let currentIndex = 0;

    // Add headers
    headers.forEach((header, idx) => {
      items.push({
        type: 'header',
        key: `header-${idx}`,
        component: header.component,
      });
      if (header.sticky) {
        sticky.push(currentIndex);
      }
      currentIndex++;
    });

    // Add section list data
    if (sectionListConfig?.sections) {
      sectionListConfig.sections.forEach((section, sectionIdx) => {
        items.push({
          type: 'sectionHeader',
          key: `section-header-${sectionIdx}`,
          section,
        });
        currentIndex++;

        section.data.forEach((item, itemIdx) => {
          const itemKey = sectionListConfig.keyExtractor 
            ? sectionListConfig.keyExtractor(item, itemIdx)
            : `section-${sectionIdx}-item-${itemIdx}`;
          
          items.push({
            type: 'sectionItem',
            key: itemKey,
            item,
            section,
            index: itemIdx,
          });
          currentIndex++;
        });
      });
    }

    // Add flat list data
    if (flatListConfig?.data) {
      if (flatListConfig.header) {
        items.push({
          type: 'flatHeader',
          key: 'flat-header',
          component: flatListConfig.header,
        });
        currentIndex++;
      }

      flatListConfig.data.forEach((item, idx) => {
        const itemKey = flatListConfig.keyExtractor
          ? flatListConfig.keyExtractor(item, idx)
          : `flat-item-${idx}`;
        
        items.push({
          type: 'flatItem',
          key: itemKey,
          item,
          index: idx,
        });
        currentIndex++;
      });
    }

    return { data: items, stickyIndices: sticky };
  }, [headers, sectionListConfig, flatListConfig]);

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
      case 'flatHeader':
        return <View>{item.component}</View>;

      case 'sectionHeader':
        return sectionListConfig?.renderSectionHeader?.({ section: item.section }) || null;

      case 'sectionItem':
        return sectionListConfig?.renderItem?.({
          item: item.item,
          index: item.index,
          section: item.section,
        }) || null;

      case 'flatItem':
        return flatListConfig?.renderItem?.({
          item: item.item,
          index: item.index,
        }) || null;

      default:
        return null;
    }
  };

  const getItemType = (item: any) => {
    return item.type;
  };

  const keyExtractor = (item: any) => {
    return item.key;
  };

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      getItemType={getItemType}
      keyExtractor={keyExtractor}
      stickyHeaderIndices={stickyIndices.length > 0 ? stickyIndices : undefined}
      {...flashListProps}
    />
  );
};

export default WrappedUnifiedList;