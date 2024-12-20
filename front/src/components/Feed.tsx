import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Navigations/StackNavigator';
import { TabParamList } from '../Navigations/TabNavigator';
import { colors } from '../constants/color';
import { stackNavigations } from '../constants';
import useAuth from '../hooks/queries/useAuth';
import { fetchTotalPriceByMonth, fetchRecentPurchases } from '../api/purchaseApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

const adImages = [
  require('../assets/C101.png'),
  require('../assets/C102.png'),
  require('../assets/C106.png'),
  require('../assets/C104.png'),
];

type FeedNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'FeedStack'>,
  StackNavigationProp<StackParamList>
>;

function AdContainer() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % adImages.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [screenWidth]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / screenWidth);
    setCurrentAdIndex(newIndex);
  };

  return (
    <View style={styles.adContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ width: screenWidth }}
      >
        {adImages.map((image, index) => (
          <Image key={index} source={image} style={[styles.adImage, { width: screenWidth }]} />
        ))}
      </ScrollView>
    </View>
  );
}

function Feed() {
  const { isLogin } = useAuth();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<FeedNavigationProp>();

  useEffect(() => {
    const getTotalPrice = async () => {
      try {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        if (isLogin) {
          const price = await fetchTotalPriceByMonth(year, month);
          setTotalPrice(price);
        }
      } finally {
        setLoading(false);
      }
    };

    const getRecentPurchases = async () => {
      try {
        if (isLogin) {
          const purchases = await fetchRecentPurchases();
          setRecentPurchases(purchases);
        }
      } catch (error) {

      }
    };

    if (isLogin) {
      getTotalPrice();
      getRecentPurchases();
    }
  }, [isLogin]);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('AccountBook')}>
            <View>
              <Text style={styles.title}>이번 달 사용 금액</Text>
              {loading ? (
                <ActivityIndicator size="large" color={colors.GRAY_100} />
              ) : (
                <View style={styles.headerContent}>
                  <Text style={styles.amount}>{totalPrice?.toLocaleString()}원</Text>
                  <View style={styles.iconsContainer}>
                    <Ionicons name="calendar-clear-outline" size={30} color={colors.BLUE_250} />
                    <Text style={styles.iconText}>내역</Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.recentOrders}>
            <Text style={styles.subTitle}>최근 구매 목록</Text>
            {recentPurchases.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.orderList}>
                  {recentPurchases[recentPurchases.length-1].purchaseProducts.map((item, index) => (
                    <View key={index} style={styles.orderItemWrapper}>
                      <View style={styles.orderItem}>
                        <View style={styles.imageWrapper}>
                          <Text style={styles.orderDate}>{recentPurchases[0].purchaseDate}</Text>
                          <Image
                            style={styles.image}
                            source={{ uri: `${item.productImage}?timestamp=${new Date().getTime()}` }}
                          />
                        </View>
                      </View>
                      <View style={styles.TextStyles}>
                        <Text style={styles.orderText}>{item.productName}</Text>
                        <Text style={styles.orderPrice}>{item.totalPrice}원</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.noPurchasesText}>최근 구매한 물품이 없습니다</Text>
            )}
          </View>
        </>
      ) : (
        <Pressable style={styles.loggedOutContainer} onPress={() => navigation.navigate(stackNavigations.LOGIN)}>
          <Text style={styles.loggedOutText}>로그인하고 이번 달 사용 금액을 조회하세요.</Text>
        </Pressable>
      )}
      <View style={styles.content}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate(stackNavigations.MAPSCREEN)}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>주변 마트 찾기</Text>
                <Text style={styles.buttonSubtitle}>연동 가능한</Text>
                <Text style={styles.buttonSubtitle}>주변 마트 찾기</Text>
              </View>
              <Image source={require('../assets/map_button.png')} style={styles.buttonImage1} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate('QRCodeScannerScreen')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>QR 결제</Text>
                <Text style={styles.buttonSubtitle}>QR코드를 인식해</Text>
                <Text style={styles.buttonSubtitle}>결제할 수 있어요!</Text>
              </View>
              <Image source={require('../assets/QR_button.png')} style={styles.buttonImage2} />
            </View>
          </TouchableOpacity>
        </View>
        <AdContainer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: colors.BLUE_250,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 20,
    color: colors.WHITE,
  },
  amount: {
    fontSize: 30,
    color: colors.WHITE,
    marginTop: 10,
  },
  recentOrders: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: colors.WHITE,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 15,
  },
  orderList: {
    flexDirection: 'row',
  },
  orderItemWrapper: {
    width: 170,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    width: '100%',
    height: 150,
    backgroundColor: colors.GRAY_100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  orderDate: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 14,
    color: colors.BLACK,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 2,
    borderRadius: 5,
    zIndex: 1,
  },
  orderText: {
    fontSize: 14,
    color: colors.BLACK,
    marginTop: 5,
    textAlign: 'center',
  },
  orderSubText: {
    fontSize: 12,
    color: colors.GRAY_500,
    marginBottom: 5,
    textAlign: 'center',
  },
  orderPrice: {
    fontSize: 14,
    color: colors.GRAY,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  loggedOutContainer: {
    backgroundColor: colors.GRAY_250,
    paddingVertical: 20,
    paddingHorizontal: 35,
    borderRadius: 15,
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loggedOutText: {
    fontSize: 18,
    color: colors.GRAY_700,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: colors.GRAY_250,
    borderRadius: 10,
    width: '48%',
  },
  largeButton: {
    height: 130,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
  },
  textContainer: {
    flex: 1,
  },
  buttonImage1: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  buttonImage2: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
    alignSelf: 'flex-start',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: colors.GRAY_500,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  adContainer: {
    backgroundColor: colors.GRAY_250,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 140,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyIcon: {
    width: 30,
    height: 30,
    color: colors.BLUE_250,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 15,
  },
  iconText: {
    fontSize: 16,
    color: colors.BLUE_250,
    marginLeft: 4,
  },
  noPurchasesText: {
    fontSize: 16,
    color: colors.GRAY_500,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  TextStyles : {
    alignItems : 'flex-start',
    width: '95%',
  }
});

export default Feed;
