import React, { useEffect, useState } from 'react';
import { Acessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { format } from 'date-fns';
import { Alert } from 'react-native';

import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getPlataformDate } from '../../utils/getPlataformDate';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarsDTO';
import { getAccessoryIcon } from  '../../utils/getAccessoryIcon'
import { api } from '../../services/api';

import {
 Container,
 Header,
 CarImages,
 Content,
 Details,
 Description,
 Brand,
 Name,
 Rent,
 Period,
 Price,
 About,
 Acessories,
 Footer,
 RentalPeriod,
 CalendarIcon,
 DateInfo,
 DateTitle,
 DateValue,
 RentalPrice,
 RentalPriceLabel,
 RentalPriceDetails,
 RentalPriceQuota,
 RentalPriceTotal
} from './styles';

interface Params {
  carDTO : CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}


export function SchedullingDetails(){
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod )
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const navigation = useNavigation();
  const  route  = useRoute();
  const { carDTO, dates } = route.params as Params;

  const rentTotal = Number(dates.length * carDTO.price)

  async function handleConfirm(){
    setLoading(true);
    const schedullingByCar = await api.get(`/schedules_bycars/${carDTO.id}`);

    const unavailable_dates = {
      ...schedullingByCar.data.unavailable_dates,
      ...dates,
    };

    api.post('schedules_byuser', {
      user_id: 1,
      car: carDTO,
      startDate: format(getPlataformDate(new Date(dates[0])),'dd/MM/yyyy'),
      endDate: format(getPlataformDate(new Date(dates[dates.length -1])),'dd/MM/yyyy'),         
    })

    api.put(`/schedules_bycars/${carDTO.id}`,{
      id:carDTO.id,
      unavailable_dates
    })
    .then(() => navigation.navigate('Confirmation', {
      title: 'Agendamento realizado com sucesso!',
      message: `Agora você só precisa ir\nAté a concessionária da RENTX\npara retirar o carro`,
      nextScreenRoute: 'Home',
    }))
    .catch(() => {
      Alert.alert("Não foi possível realizar o agendamento");
      setLoading(false) ; 
    }) 
  }

  function handleGoBack(){
    navigation.goBack();
  }

  useEffect(()=>{
    setRentalPeriod({
      start: format(getPlataformDate(new Date(dates[0])),'dd/MM/yyyy'),
      end: format(getPlataformDate(new Date(dates[dates.length -1])),'dd/MM/yyyy'),
    })
  },[])

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack}/>
      </Header>
      <CarImages>
        <ImageSlider imageUrl={carDTO.photos}/>
      </CarImages>
      <Content>
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
        <Acessories>
        {
          carDTO.accessories.map(accessory => (
            <Acessory 
            key={accessory.type}
            name={accessory.name}
            icon={getAccessoryIcon(accessory.type)}
            />
            ))          
        }
        </Acessories>
        <RentalPeriod>
          <CalendarIcon>
            <Feather 
              name='calendar'
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>

            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>
          <Feather 
              name='chevron-right'
              size={RFValue(10)}
              color={theme.colors.text}
            />
          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${carDTO.price} x ${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>          
          </RentalPriceDetails>

        </RentalPrice>

      </Content>
      <Footer>
        <Button 
          title='Alugar agora' 
          color={ theme.colors.success} 
          onPress={handleConfirm}
          enabled={!loading}
          loading={loading}
          />          
      </Footer>
    </Container>
  );
}