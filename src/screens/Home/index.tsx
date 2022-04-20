import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize'
import { useNavigation } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync'

import { database } from '../../database';
import { Car as ModelCar } from '../../database/model/car'

import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarsDto';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const netInfo = useNetInfo()

  function handleCarDetails(carDTO: CarDTO) {
    navigation.navigate('CarDetails', { carDTO });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const { data } = await api
          .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`)
        const { changes, latestVersion } = data
        return { changes, timestamp: latestVersion }
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users
        await api.post('users/sync', user)
      }
    })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchCars() {
      try {
        const response = await api.get('/cars')
        if (isMounted) setCars(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCars();

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {!loading &&
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>
      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Car
              data={item}
              onPress={() => handleCarDetails(item)}
            />}
        />
      }
    </Container>
  );
}