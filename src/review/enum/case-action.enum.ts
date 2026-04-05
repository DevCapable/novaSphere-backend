import { AppStatus } from '@app/core/enum';

export enum CaseActionEnum {
  SUBMIT = 'SUBMIT',
  SEND_FORWARD = 'SEND_FORWARD',
  RECOMMEND_RETURN = 'RECOMMEND_RETURN',
  REASSIGN = 'REASSIGN',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  RETURN = 'RETURN',
  CLAIM = 'CLAIM',
  SEND_TO = 'SEND_TO',
}

export const ActionToStatusMap: Record<CaseActionEnum, AppStatus> = {
  [CaseActionEnum.SUBMIT]: AppStatus.PENDING,
  [CaseActionEnum.SEND_FORWARD]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.RECOMMEND_RETURN]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.REASSIGN]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.CLAIM]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.APPROVE]: AppStatus.APPROVED,
  [CaseActionEnum.REJECT]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.SEND_TO]: AppStatus.UNDER_REVIEW,
  [CaseActionEnum.RETURN]: AppStatus.RETURNED,
};
