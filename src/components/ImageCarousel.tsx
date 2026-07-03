import React, { useState } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';

interface ImageCarouselProps {
  images: string[];
}

const { width } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: 300 }}
            resizeMode="contain"
            className="bg-gray-100"
          />
        )}
      />
      <View className="flex-row justify-center mt-4 mb-2 absolute bottom-4 w-full">
        {images.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              i === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
};
