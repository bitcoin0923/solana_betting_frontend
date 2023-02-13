import { Modal } from 'antd';
import styled from 'styled-components';

import { Typography, TypographyType } from '../common/typography';

const ModalWrapper = styled(Modal)`
  color: ${({ theme }) => theme.colors.text1};
  border-radius: 12px;
  overflow: hidden;

  .ant-modal-content {
    background-color: ${({ theme }) => theme.colors.grey1};

    .ant-modal-close {
      color: ${({ theme }) => theme.colors.white};
    }

    .ant-modal-body {
      padding: 3rem;
    }
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const LootItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 2rem;
  width: 12rem;
  text-align: center;
`;

const LootImage = styled.div`
  background: radial-gradient(
    50.08% 49.91% at 50% 50%,
    rgb(29, 29, 27) 46.65%,
    rgb(24, 24, 23) 66.03%,
    rgb(10, 10, 10) 88.29%,
    rgb(0, 0, 0) 100%
  );
  border-radius: 12px;
  padding: 30px;

  > img {
    width: 100%;
    height: 100%;
  }
`;

interface IBoostModal {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  lootList: any[];
}

const LootModal: React.FC<IBoostModal> = ({ visible, loading, onClose, lootList }) => (
  <ModalWrapper centered closable footer={null} onCancel={onClose} title="" visible={visible} width="60rem">
    <Content>
      {loading ? (
        <Typography type={TypographyType.BOLD_TITLE}>Loading...</Typography>
      ) : (
        lootList.map((loot) => (
          <LootItem key={loot.mint}>
            <LootImage>
              <img alt="" src={loot.image} />
            </LootImage>
            <Typography type={TypographyType.REGULAR}>{loot.name}</Typography>
          </LootItem>
        ))
      )}
    </Content>
  </ModalWrapper>
);

export default LootModal;
