import styled from 'styled-components/native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { RFValue } from 'react-native-responsive-fontsize'



export const Container = styled.View`
  padding: 0 24px;
  background-color: ${({ theme }) => theme.colors.background_primary};
`

export const Header = styled.View`
  width: 100%;
  /* Aqui estamos pegando a altura do status bar e somando com a altura do Header */
  margin-top: ${getStatusBarHeight() + 116}px;
  
`

export const Title = styled.Text`
  font-size: ${RFValue(30)}px;
  font-family: ${({ theme }) => theme.fonts.secundary_600};
  color: ${({ theme }) => theme.colors.title};
`

export const Subtitle = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${RFValue(25)}px;
  margin-top: 16px;
`

export const Footer = styled.View`
`

export const Form = styled.View`
  margin: 64px 0;
`