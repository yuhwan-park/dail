// dependencies
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sendPasswordResetEmail } from 'firebase/auth';

// sources
import { auth } from 'firebase-source';

// styles
import {
  Container,
  ErrorMessage,
  Form,
  FormContainer,
  InputContainer,
  LinkStyle,
  Logo,
  SubmitInput,
  TextInput,
} from 'style/sign-page';

interface IUpdatePasswordFormData {
  email: string;
}

function RequestUpdatePassword() {
  const [email, setEmail] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdatePasswordFormData>();

  const onSubmitEmail = async ({ email }: IUpdatePasswordFormData) => {
    setEmail(email);
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <Container>
      <Link to={'/'}>
        <Logo>dail</Logo>
      </Link>

      <EFormContainer>
        {email ? (
          <Paragraph>
            {email} 로 비밀번호 재설정 메일을 전송하였습니다. 확인해주세요.
          </Paragraph>
        ) : (
          <Form onSubmit={handleSubmit(onSubmitEmail)}>
            <InputContainer>
              <FontAwesomeIcon icon={faEnvelope} />
              <TextInput
                {...register('email', {
                  required: '필수 항목입니다.',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i,
                    message: '이메일 형식에 맞지 않습니다.',
                  },
                })}
                placeholder="이메일"
              />
            </InputContainer>

            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}

            <SubmitInput type="submit" value="메일 전송" />
          </Form>
        )}

        <Link to={'/signin'}>
          <ELinkStyle>로그인 화면으로 돌아가기</ELinkStyle>
        </Link>
      </EFormContainer>
    </Container>
  );
}

export default RequestUpdatePassword;

const EFormContainer = styled(FormContainer)`
  max-width: 400px;
`;

const ELinkStyle = styled(LinkStyle)`
  width: 100%;
  text-align: center;
  padding-top: 40px;
`;
const Paragraph = styled.div`
  padding: 20px 0;
  font-size: ${props => props.theme.fontSize.medium};
  line-height: 24px;
`;
