import React, { useEffect, useState } from 'react'
import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native'
import * as Yup from 'yup'

import { useTheme } from 'styled-components'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { PasswordInput } from '../../components/PasswordInput'

import {
  Container,
  Footer,
  Form,
  Header,
  Subtitle,
  Title
} from './styles'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

export function SignIn() {
  const theme = useTheme()
  const navigation = useNavigation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup
          .string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup
          .string()
          .required('Senha é obrigatória'),
      })

      await schema.validate({ email, password })
      console.log("Validation passed")

      signIn({ email, password })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return Alert.alert(error.message)
      } else {
        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais.')
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate('SignUpFirstStep')
  }

  return (
    // Keyboard avoiding view ajuda na posiçao quando o teclado abre
    // é bom notar que ele fica no começo de tudo então todos são filhos dele
    <KeyboardAvoidingView behavior='position' enabled>
      {/* Touchable without feedback também deve ter somente 1 filho. Essa é uma técnica para fechar o teclado quando clicar em outro lugar */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={'dark-content'}
          />
          <Header>
            <Title>
              Estamos{'\n'}
              Quase lá.
            </Title>
            <Subtitle>
              Faça seu login para começar{'\n'}
              uma experiência incrível.
            </Subtitle>
          </Header>

          <Form>
            {/* Placeholder quando não tiver conteúdo é o que vai aparecer */}
            {/* Autocorrect em campo de email é uma boa prática */}
            {/* Autocapitalize é bom desativar em campo de email também */}
            <Input
              iconName='mail'
              placeholder='E-mail'
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={setEmail}
              value={email}
            />
            <PasswordInput
              iconName='lock'
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            {/* Usar loading e enabled de maneira separada é uma boa prática. */}
            <Button
              title='Login'
              onPress={handleSignIn}
              enabled
              loading={false}
            />

            <Button
              title='Criar conta gratuita'
              light
              color={theme.colors.background_secondary}
              onPress={handleNewAccount}
              enabled
              loading={false}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}