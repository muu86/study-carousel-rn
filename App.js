import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { getMovies } from './api';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.72;
const SPACING = 10;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
)

export default function App() {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
    }

    if (movies.length === 0) {
      fetchData();
    }
  })

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: {contentOffset: { x: scrollX }}}],
          { useNativeDriver: false }
        )}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  padding: SPACING * 2,
                  marginHorizontal: SPACING,
                  alignItems: 'center',
                  transform: [{ translateY }]
                }}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
              </Animated.View>
              <Text>{item.title}</Text>
            </View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    margin: 0,
    marginBottom: 10,
  }
});
