import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated'
import { getStatusBarHeight } from 'react-native-iphone-x-helper';


import { ImageSlider } from '../../components/ImageSlider';
import { Acessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  CarImages,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer

} from './styles';
import { CarDTO } from '../../dtos/CarsDto';
import { useTheme } from 'styled-components';

interface Params {
  carDTO: CarDTO;
}

export function CarDetails() {

  const navigation = useNavigation();
  const route = useRoute();
  const { carDTO } = route.params as Params;
  const theme = useTheme();

  const scrollY = useSharedValue(0);
  const scrollHandle = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  })

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 65],
        Extrapolate.CLAMP
      )
    }
  }
  )

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  })

  function handleConfirmRental() {
    navigation.navigate('Schedulling', { carDTO });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useState(() => {
    console.log("lendo o rote", route.params);
  });

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View style={
        [
          headerStyleAnimation,
          styles.header,
          { backgroundColor: theme.colors.background_secondary }
        ]}>
        <Header>
          <BackButton onPress={handleGoBack} />
        </Header>

        <Animated.View style={sliderCarsStyleAnimation}>
          <CarImages>
            <ImageSlider imageUrl={carDTO.photos} />
          </CarImages>
        </Animated.View>

      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandle}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{carDTO.brand}</Brand>
            <Name>{carDTO.name}</Name>
          </Description>
          <Rent>
            <Period>{carDTO.period}</Period>
            <Price>R$ {carDTO.price}</Price>
          </Rent>
        </Details>
        <Accessories>
          {
            carDTO.accessories.map(accessory => (
              <Acessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>
        <About>{carDTO.about}{carDTO.about}{carDTO.about}{carDTO.about}{carDTO.about}</About>
      </Animated.ScrollView>

      <Footer>
        <Button title='Escolher período de aluguel' onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1
  }
})