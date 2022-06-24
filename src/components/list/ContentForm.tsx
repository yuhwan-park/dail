import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  allDocumentState,
  dateSelector,
  documentState,
  myListDocsState,
  selectedListState,
} from 'atoms';
import { auth, db } from 'firebase-source';
import { ITaskFormData } from 'types';
import { useSetDocCount } from 'hooks/useSetDocCount';

function ContentForm() {
  const date = useRecoilValue(dateSelector);
  const setDocuments = useSetRecoilState(documentState);
  const setMyListDocs = useSetRecoilState(myListDocsState);
  const setAllDocument = useSetRecoilState(allDocumentState);
  const setDocCount = useSetDocCount();
  const selectedList = useRecoilValue(selectedListState);
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

  const onToDoSubmit = async ({ title }: ITaskFormData) => {
    setValue('title', '');
    if (!auth.currentUser) return;
    const docRef = selectedList
      ? doc(collection(db, `${auth.currentUser.uid}/Lists/${selectedList.id}`))
      : doc(collection(db, `${auth.currentUser.uid}/${date}/Document`));
    const allDocRef = doc(db, `${auth.currentUser.uid}/All`);
    const data = {
      id: docRef.id,
      title,
      content: '',
      createdAt: Timestamp.fromDate(new Date()),
      isDone: false,
      isDeleted: false,
      isNote,
      priority: 4,
      date: selectedList ? '' : date,
      list: selectedList ? selectedList : null,
    };
    if (selectedList) {
      setMyListDocs(prev => [...prev, data]);
    } else {
      setDocuments(prev => [...prev, data]);
      await setDocCount(date, true);
    }
    setAllDocument(docs => ({ ...docs, [data.id]: data }));

    await setDoc(allDocRef, { docMap: { [data.id]: data } }, { merge: true });
    await setDoc(docRef, data);
  };
  return (
    <FormContainer onSubmit={handleSubmit(onToDoSubmit)}>
      <input
        type="text"
        {...register('title', { required: true })}
        placeholder={
          selectedList && selectedList.title.length < 15
            ? `"${selectedList?.title}"에 할 일 혹은 노트를 추가해보세요`
            : '할 일 혹은 노트를 추가해보세요.'
        }
      />
      <select onChange={onSelectChange}>
        <option value="toDo">할일</option>
        <option value="note">노트</option>
      </select>
    </FormContainer>
  );
}

export default memo(ContentForm);

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
