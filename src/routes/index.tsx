import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { CarDTO } from '../dtos/CarsDto';
import { useAuth } from '../hooks/auth';
import { AppTabRoutes } from './app.tab.routes';
import { AuthRoutes } from './auth.routes';
import { AppStackRoutes } from './app.stack.routes';
import { Car } from '../database/model/car';

export type RootStackParamList = {
  Home: undefined,
  CarDetails: { carDTO: CarDTO },
  Schedulling: Object,
  SchedullingDetails: Object,
  Confirmation: Object,
  MyCars: undefined,
  Splash: undefined,
  SignIn: undefined,
  SignUpFirstStep: undefined,
  SignUpSecondStep: Object,
  Profile: undefined,
  AppStackRoutes: undefined,
};

export function Routes() {
  const { user } = useAuth()

  return (
    <NavigationContainer>
      {user.id ? <AppTabRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}