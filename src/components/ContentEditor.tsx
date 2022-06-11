import styled from 'styled-components';
import { Editor } from '@toast-ui/react-editor';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { paramState, selectedDocumentState, selectedListState } from 'atoms';
import { updateDoc } from 'firebase/firestore';
import { useGetDocRef, useGetListDocRef, useUpdateDocs } from 'hooks';
import { useMemo } from 'react';
import EditorHeader from './ContentEditor/EditorHeader';

export default function ContentEditor() {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const myList = useRecoilValue(selectedListState);
  const params = useRecoilValue(paramState);
  const document = useRecoilValue(selectedDocumentState);
  const flag = useRef(true);
  const updator = useUpdateDocs();
  const editorRef = useMemo(() => React.createRef<Editor>(), []);
  const docRef = useGetDocRef(params['id']);
  const ListDocRef = useGetListDocRef(myList?.id, params['id']);

  const onKeyUpEditor = () => {
    const content = editorRef.current?.getInstance().getMarkdown();
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(async () => {
      updator(params['id'], 'content', content);
      if (myList) {
        if (ListDocRef) await updateDoc(ListDocRef, { content });
      } else {
        if (docRef) await updateDoc(docRef, { content });
      }
    }, 1000);
    setTimer(newTimer);
  };

  const onBlurEditor = () => {
    const content = editorRef.current?.getInstance().getMarkdown();
    setTimeout(async () => {
      updator(params['id'], 'content', content);
      if (myList) {
        if (ListDocRef) await updateDoc(ListDocRef, { content });
      } else {
        if (docRef) await updateDoc(docRef, { content });
      }
    }, 100);
  };

  useEffect(() => {
    flag.current = true;
  }, [params]);

  useEffect(() => {
    if (flag && document) {
      // 페이지 로드 & ID 파라미터가 바뀔때만 실행되게 분기처리
      editorRef.current?.getInstance().setMarkdown(document.content, false);
      flag.current = false;
    }
  }, [document, editorRef, flag]);

  return (
    <Wrapper className="show-editor-trigger">
      {params['id'] ? (
        <>
          <EditorHeader />
          <EditorContainer>
            <Editor
              height="100%"
              initialEditType="wysiwyg"
              autofocus={false}
              hideModeSwitch={true}
              toolbarItems={[
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task'],
                ['image', 'link'],
              ]}
              placeholder="설명"
              ref={editorRef}
              onKeyup={onKeyUpEditor}
              onBlur={onBlurEditor}
            />
          </EditorContainer>
        </>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
`;

const EditorContainer = styled.div`
  height: calc(100% - 50px);
`;
