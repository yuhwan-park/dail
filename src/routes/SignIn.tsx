import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { auth } from '../firebase';
import { IFormData } from '../types';

function SignIn() {
  const [error, setError] = useState('');
  const navigator = useNavigate();
  const methods = useForm<IFormData>();
  const onSubmit = async ({ email, password }: IFormData) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
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
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AuthForm />
        </form>
        {error ? error : null}
      </FormProvider>
      <div>sign In form</div>
    </>
  );
}

export default SignIn;
