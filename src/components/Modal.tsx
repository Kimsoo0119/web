import React from "react";
import styled from "styled-components";
import { WindowSize } from "../constants/const";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean; // 버튼 표시 여부를 결정하는 prop 추가
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  style,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent style={style}>
        {showCloseButton && <CloseButton onClick={onClose}>X</CloseButton>}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 최상위에 표시되도록 z-index 설정 */
`;

const ModalContent = styled.div<{ style?: React.CSSProperties }>`
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: ${WindowSize.width * 0.8}px;
  max-width: 600px;
  max-height: ${WindowSize.height * 0.9}px;
  overflow-y: auto;
  ${({ style }) =>
    style &&
    `
      ${style}
    `};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;
