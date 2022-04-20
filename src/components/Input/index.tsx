import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components'
import { TextInputProps } from 'react-native'

import {
  Container, IconContainer, InputText
} from './styles'

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function Input({
  iconName,
  value,
  ...rest
}: InputProps) {
  const theme = useTheme()

  const [isFilled, setIsFilled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!value)
  }

  return (
    // Como o pai muda o estado do input todo também muda, isso faz com que o teclado feche e abra
    <Container>
      <IconContainer
        isFocused={isFocused}
      >
        <Feather
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>

      <InputText
        isFocused={isFocused}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  )
}