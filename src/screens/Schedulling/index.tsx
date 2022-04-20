import React,  {useState} from 'react';
import { useTheme } from 'styled-components'
import { StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';


import ArrowSvg from '../../assets/arrow.svg'
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarsDto';
import { getPlataformDate } from '../../utils/getPlataformDate';

import { 
Calendar, 
  DayProps, 
  generateInterval,
  MarkedDatesProps
} from '../../components/Calendar';

import {
  Container, 
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DataTitle,
  DateValue,
  Content,
  Footer  
} from './styles';

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  carDTO : CarDTO;
}

export function Schedulling(){

  const [lastSelectedDate,setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates,setMarkedDates] = useState<MarkedDatesProps>({} as MarkedDatesProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();
  const route = useRoute();
  const { carDTO } = route.params as Params;

  const navigation = useNavigation();

  const rentalPeriodInformed = !!rentalPeriod.startFormatted && !!rentalPeriod.endFormatted;

  function handleConfirm(){
    navigation.navigate('SchedullingDetails',
    { 
      carDTO,
      dates: Object.keys(markedDates)
      })
  }

  function handleGoBack(){
    navigation.goBack();
  }

  function handleChangeDate(date : DayProps) {

    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;    
   
    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length -1];

    setRentalPeriod({
      startFormatted: format(getPlataformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy')
     })
  }

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
        <RentalPeriod>
          <DateInfo>
            <DataTitle>DE</DataTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>
              {rentalPeriod.startFormatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DataTitle>ATÉ</DataTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>          
        </RentalPeriod>
      </Header>
      <Content>
        <Calendar 
          markedDates={markedDates}        
          onDayPress={handleChangeDate}
        />
      </Content>
      <Footer>
        <Button 
          title='Confirmar' 
          onPress={handleConfirm} 
          enabled ={rentalPeriodInformed} 
        />
      </Footer>

    </Container>
  );
}