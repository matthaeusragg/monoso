import { FlashList } from "@shopify/flash-list";
import React from 'react';
import { Card, CardProps } from './card';

export default function CardMasonry({data} : {data: CardProps[]}) {
  return (
    <FlashList
      data={data}
      numColumns={2}
      masonry
      optimizeItemArrangement={true}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Card item={item} />}
      contentContainerClassName="pb-10"
    />
  );
}