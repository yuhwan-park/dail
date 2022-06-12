import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteDoc, DocumentData, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { documentState, myListDocsState, selectedListState } from 'atoms';
import { useGetDocRef, useGetListDocRef, useUpdateDocs } from 'hooks';
import {
  faTrashCan,
  faEllipsis,
  faArrowRightArrowLeft,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { MenuButtonContainer, MenuContainer, MenuModal } from 'style/main-page';
import PriorityFlag from 'components/common/PriorityFlag';
import styled from 'styled-components';
import MoveListModal from './MoveListModal';

interface IListMenu {
  item: DocumentData;
  isEditor: boolean;
}

export default function ListMenu({ item, isEditor }: IListMenu) {
  const [isOpen, setIsOpen] = useState(false);
  const [moveListFlag, setMoveListFlag] = useState(false);
  const setDocument = useSetRecoilState(documentState);
  const setMyListDocs = useSetRecoilState(myListDocsState);
  const myList = useRecoilValue(selectedListState);
  const navigator = useNavigate();
  const updator = useUpdateDocs();
  const docRef = useGetDocRef(item.id);
  const menuRef = useRef<HTMLDivElement>(null);
  const ListDocRef = useGetListDocRef(myList?.id, item.id);

  const onClickMenu = () => {
    setIsOpen(prev => !prev);
  };

  const onClickDelete = async () => {
    setDocument(todos => todos.filter(todo => todo.id !== item.id));
    setMyListDocs(docs => docs.filter(doc => doc.id !== item.id));
    if (myList) {
      if (ListDocRef) await deleteDoc(ListDocRef);
      navigator(`/main/lists/${myList.id}/tasks`);
    } else {
      if (docRef) await deleteDoc(docRef);
      navigator('/main');
    }
  };

  const onClickConvert = async () => {
    updator(item.id, 'isNote', !item.isNote);
    if (myList) {
      if (ListDocRef) await updateDoc(ListDocRef, { isNote: !item.isNote });
    } else {
      if (docRef) await updateDoc(docRef, { isNote: !item.isNote });
    }
  };

  const onClickMoveList = () => {
    setMoveListFlag(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutSide = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  return (
    <MenuContainer ref={menuRef}>
      <ListMenuIconContainer isEditor={isEditor} onClick={onClickMenu}>
        <FontAwesomeIcon icon={faEllipsis} className="toggle-menu-icon" />
      </ListMenuIconContainer>
      {isOpen ? (
        <MenuModal>
          {!item.isNote && <PriorityFlag todo={item} />}

          {moveListFlag && <MoveListModal item={item} />}
          <MenuButtonContainer onClick={onClickMoveList}>
            <FontAwesomeIcon icon={faListUl} className="sub-icon" />
            <span>리스트 이동</span>
          </MenuButtonContainer>

          <MenuButtonContainer onClick={onClickConvert}>
            <FontAwesomeIcon
              icon={faArrowRightArrowLeft}
              className="sub-icon"
            />
            <span>{item.isNote ? '할일로 변환' : '노트로 변환'}</span>
          </MenuButtonContainer>

          <MenuButtonContainer onClick={onClickDelete}>
            <FontAwesomeIcon icon={faTrashCan} className="sub-icon" />
            <span>삭제하기</span>
          </MenuButtonContainer>
        </MenuModal>
      ) : null}
    </MenuContainer>
  );
}

const ListMenuIconContainer = styled.div<{ isEditor: boolean }>`
  .toggle-menu-icon {
    opacity: ${props => (props.isEditor ? 1 : 0)};
  }
`;
