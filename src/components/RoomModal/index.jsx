import { Modal } from "antd";
import React, { useEffect, useState } from "react";

const RoomModal = ({ isModalVisible }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isModalVisible);
  }, [isModalVisible]);
  return (
    <div>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={() => setVisible(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default RoomModal;
