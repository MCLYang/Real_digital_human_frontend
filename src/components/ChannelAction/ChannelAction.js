import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";

const ChannelAction = ({ onChannelDataChange }) => {
  const [isCreateChannel, setIsCreateChannel] = useState(false); // 是否创建频道
  const [channelData, setChannelData] = useState({
    channel_id: "",
    token: "",
    uid: "",
  });

  const channelAction = async () => {
    if (isCreateChannel) {
      // 关闭频道逻辑
      try {
        if (!channelData.channel_id) {
          return;
        }
        const response = await axios.get(
          `http://13.212.91.127/close_channel?channel_id=${channelData.channel_id}`
        );
        console.log("关闭频道响应：", response.data);
        setChannelData({ channel_id: "", token: "", uid: "" });
        setIsCreateChannel(false);
        onChannelDataChange({ channel_id: "", token: "", uid: "" });
      } catch (error) {
        console.error("关闭频道失败：", error);
      }
    } else {
      // 创建频道逻辑
      try {
        const response = await axios.get("http://13.212.91.127/get_channel");
        const { channel_id, token, uid } = response.data;
        console.log("创建频道响应：", response.data);
        setChannelData({ channel_id, token, uid });
        setIsCreateChannel(true);
        onChannelDataChange({ channel_id, token, uid });
      } catch (error) {
        console.error("创建频道失败：", error);
      }
    }
  };

  return (
    <Button
      colorScheme={isCreateChannel ? "red" : "teal"} 
      onClick={channelAction}
      size="lg"
    >
      {isCreateChannel ? "关闭频道" : "创建频道"} 
    </Button>
  );
};

export default ChannelAction;
