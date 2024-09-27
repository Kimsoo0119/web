import React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ColorPalette } from "../common/constants/const";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "닫기",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CompletionContainer>
        <h2>{title}</h2>
        <Description>{description}</Description>
        <CloseButton onClick={onClose}>{buttonText}</CloseButton>
      </CompletionContainer>
    </Modal>
  );
};

export default CompletionModal;

const CompletionContainer = styled.div`
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: ${ColorPalette.BrandColor};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  &:hover {
    background-color: ${ColorPalette.BrandColorHover};
  }
`;

const Description = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
`;
