import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faArrowLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import {
  selectedDocumentState,
  dateState,
  isWideState,
  showEditorState,
} from 'atoms';
import CheckBox from 'components/common/CheckBox';
import ListMenu from 'components/list/ListMenu';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { CancleButton, SubmitButton } from 'style/main-page';
import { useUpdateDocs } from 'hooks';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from 'firebase-source';
import CalendarView from 'components/common/CalendarView';
import { useSetDocCount } from 'hooks/useSetDocCount';
import { devices } from 'style/media-queries';

function EditorHeader() {
  const selectedDoc = useRecoilValue(selectedDocumentState);
  const isWide = useRecoilValue(isWideState);
  const setDate = useSetRecoilState(dateState);
  const setShowEditor = useSetRecoilState(showEditorState);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newDate, setNewDate] = useState('');
  const setDocCount = useSetDocCount();
  const updator = useUpdateDocs();
  const calendarRef = useRef<HTMLDivElement>(null);

  const onClickToggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  const onClickDay = (value: Date) => {
    setNewDate(dayjs(value).format('YYYYMMDD'));
  };

  const onClickGoBack = () => {
    setShowEditor(false);
  };

  const onClickConfirmToUpdateDate = async () => {
    if (!selectedDoc || !newDate || newDate === selectedDoc.date) return;

    setShowCalendar(false);
    updator(selectedDoc, 'date', newDate, true);

    if (selectedDoc.date) {
      const oldDocRef = doc(
        db,
        `${auth.currentUser?.uid}/${selectedDoc.date}/Document/${selectedDoc.id}`,
      );
      await setDocCount(selectedDoc.date, false);
      await deleteDoc(oldDocRef);
    }
    await setDocCount(newDate, true);

    const newDocRef = doc(
      db,
      `${auth.currentUser?.uid}/${newDate}/Document/${selectedDoc.id}`,
    );
    const newItem = { ...selectedDoc, date: newDate };
    await setDoc(newDocRef, newItem);
    setDate(dayjs(newDate));
  };

  useEffect(() => {
    const handleClickOutSide = (e: any) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);
  return (
    <>
      {selectedDoc && (
        <>
          <Wrapper>
            <FrontMenuContainer>
              {!isWide && (
                <FontAwesomeIcon
                  onClick={onClickGoBack}
                  icon={faArrowLeftLong}
                  className="go-back-icon"
                  size="lg"
                />
              )}
              {!selectedDoc.isNote && <CheckBox todo={selectedDoc} />}
            </FrontMenuContainer>
            <CalendarIconContainer onClick={onClickToggleCalendar}>
              <FontAwesomeIcon icon={faCalendarDays} size="lg" />
              <span>
                {selectedDoc.date
                  ? dayjs(selectedDoc.date).format('M월D일')
                  : '없음'}
              </span>
            </CalendarIconContainer>
            {showCalendar && (
              <CalendarContainer ref={calendarRef}>
                <CalendarView
                  value={
                    selectedDoc.date ? dayjs(selectedDoc.date).toDate() : null
                  }
                  onClickDay={onClickDay}
                />
                <ButtonContainer>
                  <SubmitButton
                    type="button"
                    value="확인"
                    onClick={onClickConfirmToUpdateDate}
                  />
                  <CancleButton
                    type="button"
                    value="취소"
                    onClick={onClickToggleCalendar}
                  />
                </ButtonContainer>
              </CalendarContainer>
            )}
            <BackMenuContainer>
              <ListMenu item={selectedDoc} isEditor={true} />
            </BackMenuContainer>
          </Wrapper>

          <EditorTitleContainer>
            <EditorTitle>{selectedDoc?.title}</EditorTitle>
          </EditorTitleContainer>
        </>
      )}
    </>
  );
}

export default EditorHeader;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const FrontMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  .go-back-icon {
    color: #bbb;
    padding: 0 10px;
    cursor: pointer;
  }
`;

const BackMenuContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  margin-right: 10px;
  .toggle-menu-icon {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 300;
  background-color: white;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  @media ${devices.laptop} {
    left: -50px;
  }
`;

const EditorTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const EditorTitle = styled.div`
  width: 100%;
  padding: 10px;
  font-weight: 700;
`;

const CalendarIconContainer = styled.div`
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  border-radius: 4px;
  svg {
    color: rgba(0, 0, 0, 0.5);
  }
  span {
    padding: 0 5px;
    font-size: ${props => props.theme.fontSize.medium};
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
