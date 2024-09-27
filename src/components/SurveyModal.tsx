import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Divider from "./Divider";
import { WindowSize } from "../constants/const";
import ReactGA from "react-ga4";
interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDefer: () => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onDefer }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [comments, setComments] = useState("");
  const [gender, setGender] = useState("");
  const otherReasonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reason === "기타" && otherReasonInputRef.current) {
      otherReasonInputRef.current.focus();
    }
  }, [reason]);

  const handleSubmit = () => {
    ReactGA.event({
      category: "User",
      action: "SurveySubmitClick",
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <SurveyContainer>
        <h2>의견을 남겨주세요!</h2>

        <SurveyQuestion>성별</SurveyQuestion>
        <GenderList>
          {["남성", "여성", "기타"].map((item) => (
            <GenderItem key={item} selected={gender === item} onClick={() => setGender(item)}>
              {item}
            </GenderItem>
          ))}
        </GenderList>

        <Divider margin="2px" />

        <SurveyQuestion>사이트에 들어오게 된 이유는 무엇인가요?</SurveyQuestion>
        <ReasonList>
          {[
            "어떤 정보가 있는지 궁금해서",
            "화장실에 대한 정보를 얻기 위해",
            "우연히 발견해서",
            "깨끗한 화장실 위치를 알고 싶어서",
            "기타",
          ].map((item, index) => (
            <ReasonItem key={item} selected={reason === item} onClick={() => setReason(item)}>
              {index + 1}) {item}
              {item === "기타" && reason === "기타" && (
                <OtherReasonInputWrapper>
                  <OtherReasonInput
                    ref={otherReasonInputRef}
                    type="text"
                    placeholder="이유를 입력해주세요"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </OtherReasonInputWrapper>
              )}
            </ReasonItem>
          ))}
        </ReasonList>

        <Divider margin="2px" />

        <SurveyQuestion>추가 의견을 남겨주세요</SurveyQuestion>
        <StyledTextarea value={comments} onChange={(e) => setComments(e.target.value)} />

        <ButtonContainer>
          <DeferButton onClick={onDefer}>나중에 하기</DeferButton>
          <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
        </ButtonContainer>
      </SurveyContainer>
    </Modal>
  );
};

export default SurveyModal;

const SurveyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`;

const SurveyQuestion = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ReasonList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const GenderList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

const ReasonItem = styled.li<{ selected: boolean }>`
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${(props) => (props.selected ? "#007bff" : "#ccc")};
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#e7f1ff" : "white")};
  color: ${(props) => (props.selected ? "#007bff" : "black")};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const GenderItem = styled.li<{ selected: boolean }>`
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid ${(props) => (props.selected ? "#007bff" : "#ccc")};
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#e7f1ff" : "white")};
  color: ${(props) => (props.selected ? "#007bff" : "black")};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  &:hover {
    background-color: #f1f1f1;
  }
`;

const OtherReasonInputWrapper = styled.div`
  margin-top: 5px;
  width: 100%;
`;

const OtherReasonInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
`;

const StyledTextarea = styled.textarea`
  width: ${WindowSize.width * 0.9};
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  min-height: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 50%;
  &:hover {
    background-color: #0056b3;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    opacity: 0.8;
  }
`;

const DeferButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 50%;
  &:hover {
    background-color: #5a6268;
  }
`;
