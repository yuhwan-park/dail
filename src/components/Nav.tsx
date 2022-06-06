import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { dateState, toggleMenuState } from 'atoms';
import {
  faAngleLeft,
  faBars,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const dateVariants = {
  entry: (isBack: boolean) => ({
    x: isBack ? -100 : 100,
    opacity: 0,
    scale: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? 100 : -100,
    opacity: 0,
    scale: 0,
  }),
};

function Nav() {
  const [date, setDate] = useRecoilState(dateState);
  const [isBack, setIsBack] = useState(false);
  const setToggleMenu = useSetRecoilState(toggleMenuState);
  const navigator = useNavigate();
  const onClickNext = () => {
    setIsBack(false);
    setDate(prev => prev.add(1, 'day'));
    navigator('/main');
  };
  const onClickPrev = () => {
    setIsBack(true);
    setDate(prev => prev.add(-1, 'day'));
    navigator('/main');
  };
  const onClickMenuIcon = () => {
    setToggleMenu(prev => !prev);
  };
  return (
    <Container>
      <MenuIcon onClick={onClickMenuIcon}>
        <FontAwesomeIcon icon={faBars} />
      </MenuIcon>
      <PrevButton onClick={onClickPrev}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </PrevButton>
      <AnimatePresence custom={isBack} initial={false}>
        <Today
          custom={isBack}
          key={date.format('M/D')}
          variants={dateVariants}
          initial="entry"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween' }}
        >
          {date.format('M월 D일')}
        </Today>
      </AnimatePresence>
      <NextButton onClick={onClickNext}>
        <FontAwesomeIcon icon={faAngleRight} />
      </NextButton>
    </Container>
  );
}

export default React.memo(Nav);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #474747;
`;

const Today = styled(motion.div)`
  position: absolute;
  text-align: center;
  width: 300px;
  padding: 0 55px;
  font-size: 18px;
  color: white;
  font-family: ${props => props.theme.fontFamily.main};
`;

const Button = styled.div`
  svg {
    cursor: pointer;
    color: white;
    font-size: 30px;
  }
`;

const PrevButton = styled(Button)`
  position: relative;
  left: -100px;
  z-index: 1;
`;

const NextButton = styled(Button)`
  position: relative;
  right: -100px;
`;

const MenuIcon = styled(Button)`
  position: absolute;
  left: 40px;
`;
