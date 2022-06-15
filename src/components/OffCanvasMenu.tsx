import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { myListModalState, toggleMenuState } from 'atoms';
import UserAccount from './offCanvas/UserAccount';
import { menuVariants } from 'variants';
import MyList from './offCanvas/MyList';
import CalendarList from './offCanvas/CalendarList';
import ShowAllList from './offCanvas/ShowAllList';
import React from 'react';
import { devices } from 'style/media-queries';
import MyListModal from './offCanvas/MyListModal';

function OffCanvasMenu() {
  const toggleMenu = useRecoilValue(toggleMenuState);
  const toggleModal = useRecoilValue(myListModalState);

  return (
    <>
      <AnimatePresence>
        {toggleMenu && (
          <Wrapper
            key="offCanvas"
            variants={menuVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween' }}
          >
            <UserAccount />
            <MainMenuContainer>
              <ShowAllList />
              <CalendarList />
            </MainMenuContainer>
            <MyList />
          </Wrapper>
        )}
      </AnimatePresence>
      {toggleModal && <MyListModal />}
    </>
  );
}

export default React.memo(OffCanvasMenu);

const Wrapper = styled(motion.div)`
  height: 100%;
  background-color: rgb(244, 244, 244);
  max-width: 300px;
  overflow-y: scroll;
  @media ${devices.laptop} {
    position: absolute;
    z-index: 10;
    box-shadow: 0 6px 20px rgb(0 0 0 / 15%);
  }
  &::-webkit-scrollbar {
    width: 4px;
    margin-right: 2px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  }
`;

const MainMenuContainer = styled.div`
  padding: 10px 0;
  margin: 0 20px;
  border-bottom: 1px solid rgba(24, 24, 24, 0.1);
`;
