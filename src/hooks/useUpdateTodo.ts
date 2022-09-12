import { allDocumentState } from 'atoms';
import { setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { Document } from '@types';
import { docRef } from 'utils';

type ValueType<T> = T extends keyof Document ? Document[T] : never;

function useUpdateTodo() {
  // 클라이언트단 & DB단의 Document 데이터 필드값을 수정하는 Hook
  const setAllDocument = useSetRecoilState(allDocumentState);

  return useCallback(
    async <T extends keyof Document>(
      document: Document,
      key: T,
      value: ValueType<T>,
    ) => {
      const newDoc: Document = { ...document, [key]: value };

      setAllDocument(docs => ({
        ...docs,
        [document.id]: newDoc,
      }));

      await setDoc(docRef('All'), { [document.id]: newDoc }, { merge: true });
    },
    [setAllDocument],
  );
}

export { useUpdateTodo };
