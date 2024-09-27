import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Divider from "./Divider";
import { WindowSize } from "../constants/const";
import ReactGA from "react-ga4";
import SurveyApi from "../apis/survey-api";
import { ColorPalette } from "../common/constants/const";
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
  const [age, setAge] = useState("");
  const otherReasonInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setReason("");
    setAge("");
    setOtherReason("");
    setComments("");
    setGender("");
  };

  useEffect(() => {
    if (reason === "기타" && otherReasonInputRef.current) {
      otherReasonInputRef.current.focus();
    }
  }, [reason]);

  const isSubmitDisabled = !gender || !reason || !age;

  const handleSubmit = () => {
    ReactGA.event({
      category: "User",
      action: "SurveySubmitClick",
    });
    SurveyApi.submitSurvey({
      gender,
      reason,
      age,
      otherReason,
      comments,
    });
    onClose();
    resetState();
  };

  const handleDefer = () => {
    ReactGA.event({
      category: "User",
      action: "SurveyDeferClick",
    });
    resetState();
    onDefer();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <SurveyContainer>
        <h2 style={{ margin: "8px 0" }}>의견을 남겨주세요!</h2>

        <SurveyQuestion>성별 *</SurveyQuestion>
        <GenderList>
          {["남성", "여성", "기타"].map((item) => (
            <GenderItem key={item} selected={gender === item} onClick={() => setGender(item)}>
              {item}
            </GenderItem>
          ))}
        </GenderList>
        <SurveyQuestion>나이 *</SurveyQuestion>
        <GenderList>
          {["20대", "30대", "40대", "50대 이상"].map((item) => (
            <GenderItem key={item} selected={age === item} onClick={() => setAge(item)}>
              {item}
            </GenderItem>
          ))}
        </GenderList>

        <Divider margin="2px" />

        <SurveyQuestion>사이트에 들어오게 된 이유는 무엇인가요? *</SurveyQuestion>
        <ReasonList>
          {["어떤 정보가 있는지 궁금해서", "화장실에서 불편했던 경험이 있어서", "기타"].map(
            (item, index) => (
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
            )
          )}
        </ReasonList>

        <Divider margin="2px" />

        <SurveyQuestion>무엇을 기대하고 오셨나요?</SurveyQuestion>
        <StyledTextarea value={comments} onChange={(e) => setComments(e.target.value)} />

        <ButtonContainer>
          <DeferButton onClick={handleDefer}>나중에 하기</DeferButton>
          <SubmitButton onClick={handleSubmit} disabled={isSubmitDisabled}>
            제출하기
          </SubmitButton>
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
  border: 1px solid ${(props) => (props.selected ? ColorPalette.BrandColor : "#ccc")};
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#FFE9DC" : "white")};
  color: ${(props) => (props.selected ? ColorPalette.BrandColor : "black")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
`;

const GenderItem = styled.li<{ selected: boolean }>`
  cursor: pointer;
  padding: 6px 14px;
  border: 1px solid ${(props) => (props.selected ? ColorPalette.BrandColor : "#ccc")};
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#FFE9DC" : "white")};
  color: ${(props) => (props.selected ? ColorPalette.BrandColor : "black")};
  font-size: 14px;
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
  min-height: ${WindowSize.height * 0.2};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background-color: ${ColorPalette.BrandColor};
  color: ${ColorPalette.White};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 50%;
  &:hover {
    background-color: #febe98;
  }
`;

const DeferButton = styled.button`
  background-color: #5a6268;
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
