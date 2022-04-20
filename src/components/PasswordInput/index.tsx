import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components'
import { TextInputProps } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'

import {
  Container,
  IconContainer,
  InputText,
} from './styles'

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function PasswordInput({
  iconName,
  value,
  ...rest
}: InputProps) {
  const theme = useTheme()

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!value)
  }

  function handlePasswordVisibilityChange() {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>

      <InputText
        autoCorrect={false}
        secureTextEntry={!isPasswordVisible}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        isFocused={isFocused}
        {...rest}
      />

      <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer isFocused={isFocused}>
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  )
}