import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from 'components/auth/AuthForm';
import SocialLogin from 'components/auth/SocialLogin';
import {
  Container,
  ErrorMessage,
  Form,
  FormContainer,
  Hr,
  LinkStyle,
  Logo,
  Message,
} from 'style/sign-page';
import { auth } from 'firebase-source';
import { IFormData } from 'types';

function SignIn() {
  const [error, setError] = useState('');
  const navigator = useNavigate();
  const methods = useForm<IFormData>();

  const onSubmit = async ({ email, password }: IFormData) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        navigator('/main');
      }
    });
  }, [navigator]);
  return (
    <Container>
      <Logo draggable className="logo">
        dail
      </Logo>
      <FormContainer>
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <AuthForm isSignUp={false} />
          </Form>
          <ErrorMessage>{error ? error : null}</ErrorMessage>
        </FormProvider>
        <Link to={'/requestUpdatePassword'}>
          <LinkStyle>비밀번호가 기억나지 않아요</LinkStyle>
        </Link>
        <Hr>또는</Hr>
        <SocialLogin />
        <Message>
          계정이 없으신가요?{' '}
          <Link to={'/signup'}>
            <LinkStyle>회원가입</LinkStyle>
          </Link>
        </Message>
      </FormContainer>
    </Container>
  );
}

export default SignIn;
