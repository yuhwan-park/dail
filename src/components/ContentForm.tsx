import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { dateSelector, documentState } from '../atoms';
import { auth, db } from '../firebase';
import { ITaskFormData } from '../types';

function ContentForm() {
  const date = useRecoilValue(dateSelector);
  const setDocuments = useSetRecoilState(documentState);
  const [isNote, setIsNote] = useState(false);
  const { register, handleSubmit, setValue } = useForm<ITaskFormData>();

  const onSelectChange = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === 'note') {
      setIsNote(true);
    } else {
      setIsNote(false);
    }
  };

  const onToDoSubmit = ({ title }: ITaskFormData) => {
    setValue('title', '');
    onAuthStateChanged(auth, async user => {
      const docRef = doc(
        collection(db, `${(user as User).uid}/${date}/Document`),
      );
      const data = {
        id: docRef.id,
        title,
        content: '',
        createdAt: Timestamp.fromDate(new Date()),
        isDone: false,
        isDeleted: false,
        isNote,
      };
      setDocuments(prev => [...prev, data]);
      await setDoc(docRef, data);
    });
  };
  return (
    <FormContainer onSubmit={handleSubmit(onToDoSubmit)}>
      <input
        type="text"
        {...register('title', { required: true })}
        placeholder="할 일을 추가해보세요."
      />
      <select onChange={onSelectChange}>
        <option value="toDo">할일</option>
        <option value="note">노트</option>
      </select>
    </FormContainer>
  );
}

export default React.memo(ContentForm);

const FormContainer = styled.form`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    background-color: rgb(244, 244, 244);
  }
  select {
    position: absolute;
    right: 0;
    border: none;
    border-left: 1px solid #bbb;
    border-radius: 6px;
    height: 100%;
    outline: none;
    background-color: rgb(244, 244, 244);
  }
`;
