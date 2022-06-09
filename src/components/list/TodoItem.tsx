import React from 'react';
import { DocumentData, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { documentState } from 'atoms';
import { useGetDocRef } from 'hooks';
import { IconContainer, ListItemContainer, Title } from 'style/main-page';
import ListMenu from './ListMenu';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ITodoItemProps {
  todo: DocumentData;
}

function TodoItem({ todo }: ITodoItemProps) {
  const setDocument = useSetRecoilState(documentState);
  const docRef = useGetDocRef(todo.id);
  const navigator = useNavigate();
  const { register } = useForm();

  const onClickCheckBox = async () => {
    setDocument(todos =>
      todos.map(value =>
        value.id === todo.id ? { ...value, isDone: !todo.isDone } : value,
      ),
    );
    if (docRef) await setDoc(docRef, { isDone: !todo.isDone }, { merge: true });
  };

  const onClickList = () => {
    navigator(`/main/${todo.id}`);
  };

  const onChange = (e: any) => {
    setDocument(todos =>
      todos.map(value =>
        value.id === todo.id ? { ...value, title: e.target.value } : value,
      ),
    );
  };

  const onBlur = async (e: any) => {
    if (docRef)
      await setDoc(docRef, { title: e.target.value }, { merge: true });
  };
  return (
    <>
      <ListItemContainer>
        <IconContainer className="show-editor-trigger">
          <CheckBox
            className="check-box"
            onClick={onClickCheckBox}
            isDone={todo.isDone}
          >
            {todo.isDone ? <FontAwesomeIcon icon={faCheck} inverse /> : null}
          </CheckBox>
        </IconContainer>
        <ToDoTitle
          className="show-editor-trigger"
          type="text"
          isDone={todo.isDone}
          defaultValue={todo.title}
          onClick={onClickList}
          {...register(`todoTitle-${todo.id}`, {
            onBlur,
            onChange,
          })}
        />
        <ListMenu item={todo} />
      </ListItemContainer>
    </>
  );
}

export default React.memo(TodoItem);

const CheckBox = styled.div<{ isDone: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border: ${props => (props.isDone ? 'none' : '2px solid rgba(0,0,0,0.2)')};
  z-index: 1;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props =>
    props.isDone ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ToDoTitle = styled(Title)<{ isDone: boolean }>`
  color: ${props => (props.isDone ? '#bbb' : 'black')};
`;
