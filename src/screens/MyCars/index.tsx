import React, { useState, useEffect} from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import {  AntDesign } from '@expo/vector-icons';

import { LoadAnimation } from '../../components/LoadAnimation'
import { Car } from '../../components/Car'
import { BackButton } from '../../components/BackButton';
import { CarDTO } from '../../dtos/CarsDTO';
import { api } from '../../services/api'

import {
 Container,
 Header,
 Title,
 SubTitle,
 Content,
 Appointments,
 AppointmentsTitle,
 AppointmentsQuantity,
 CarWrapper,
 CarFooter,
 CarFooterTitle,
 CarFooterPeriod,
 CarFooterDate,
} from './styles';

interface CarProps {
  id: string;
  user_id: string;
  car : CarDTO;
  startDate:string;
  endDate:string
}

export function MyCars( ){
  const [cars, setCars] = useState<CarProps[]>([]) ;
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const theme = useTheme();

  function handleGoBack(){
    navigation.goBack();
  }


  useEffect(() => {
    async function fechCars(){
      try {
        const response = await api.get('/schedules_byuser?user_id=1')
        setCars(response.data) 
        console.log(response.data)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }

    fechCars();

  }, []);
  

  return (
    <Container>
      <StatusBar  
        barStyle={'light-content'}
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton 
          color={theme.colors.shape} 
          onPress={handleGoBack} />
        <Title>
          Escolha uma {'\n'} 
          data de inicio e{'\n'}
          fim do aluguel
        </Title>
        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>
      </Header>
      { loading ? <LoadAnimation /> :
        <Content>      
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>
          <FlatList
            data={cars} 
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => 
              <CarWrapper>
                <Car data={item.car} /> 
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name='arrowright'
                      size={20}
                      color={theme.colors.title}
                      style={{marginHorizontal: 10}}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            }
          />
        </Content>
      }
    </Container>
  );
}