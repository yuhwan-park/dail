import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { allDocumentState, documentState, myListDocsState } from 'atoms';
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
import { IDocument } from 'types';
import { auth, db } from 'firebase-source';
import { useSetDocCount } from 'hooks/useSetDocCount';
import { useDetectClickOutside } from 'hooks/useDetectClickOutside';

interface IListMenu {
  item: IDocument;
  isEditor: boolean;
}

export default function ListMenu({ item, isEditor }: IListMenu) {
  const [isOpen, setIsOpen] = useState(false);
  const [moveListFlag, setMoveListFlag] = useState(false);
  const setDocument = useSetRecoilState(documentState);
  const setMyListDocs = useSetRecoilState(myListDocsState);
  const setDocCount = useSetDocCount();
  const [allDocument, setAllDocument] = useRecoilState(allDocumentState);
  const updator = useUpdateDocs();
  const docRef = useGetDocRef(item);
  const ListDocRef = useGetListDocRef(item);
  const CloseDropdownMenu = useCallback(() => {
    setIsOpen(false);
  }, []);
  const ref = useDetectClickOutside({ onTriggered: CloseDropdownMenu });

  const onClickMenu = () => {
    setIsOpen(prev => !prev);
  };

  const onClickDelete = async () => {
    setDocument(todos => todos.filter(todo => todo.id !== item.id));
    setMyListDocs(docs => docs.filter(doc => doc.id !== item.id));

    const newAllDocument = { ...allDocument };
    delete newAllDocument[item.id];
    setAllDocument(newAllDocument);

    if (ListDocRef) await deleteDoc(ListDocRef);
    if (docRef) await deleteDoc(docRef);

    const allDocRef = doc(db, `${auth.currentUser?.uid}/All`);
    await updateDoc(allDocRef, { docMap: newAllDocument });
    await setDocCount(item.date, false);
  };

  const onClickConvert = async () => {
    await updator(item, 'isNote', !item.isNote, true);
  };

  const onClickMoveList = () => {
    setMoveListFlag(prev => !prev);
  };

  return (
    <MenuContainer ref={ref}>
      <ListMenuIconContainer isEditor={isEditor} onClick={onClickMenu}>
        <FontAwesomeIcon icon={faEllipsis} className="toggle-menu-icon" />
      </ListMenuIconContainer>
      {isOpen && (
        <MenuModal>
          {!item.isNote && (
            <PriorityFlag toggleMenu={CloseDropdownMenu} todo={item} />
          )}

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
      )}
    </MenuContainer>
  );
}

const ListMenuIconContainer = styled.div<{ isEditor: boolean }>`
  .toggle-menu-icon {
    opacity: ${props => (props.isEditor ? 1 : 0)};
  }
`;
