import { getGameHistory } from "@/services/game";
import { Popup, Row, Col } from "@nutui/nutui-react-taro";
import { ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface HistoryProps {
  roomId: string | number;
  userId: string | number;
  visible: boolean;
  onClose: () => void;
}

const History = ({ roomId, userId, visible, onClose }: HistoryProps) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    getHistory();
  };

  const getHistory = async () => {
    try {
      let res = await getGameHistory({
        roomId: roomId,
        userId: userId,
      });
      if (res.code === 0) {
        setHistory(res.data);
      }
    } catch (error) {}
  };

  console.log("history", history);

  return (
    <Popup
      title="对局记录"
      position="bottom"
      visible={visible}
      onClose={onClose}
    >
      <ScrollView style={{ maxHeight: 600 }} scrollY>
        <View style={{ padding: "10px" }}>
          {history.length > 0 ? (
            // history.map((item, index) => (
            //   <View key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            //     <View>房间名称: {item.gameResult.roomName}</View>
            //     <View>时间: {dayjs(item.gameResult.timestamp).format('YYYY-MM-DD hh:mm:ss')}</View>

            //   </View>
            // ))
            history.map((item, index) => {
              return (
                <>
                  <Row
                    key={index}
                  >
                    <Col span={12}>
                      <View>房间名称: {item.gameResult.roomName}</View>
                    </Col>
                    <Col span={12}>
                      <View>
                        {dayjs(item.gameResult.timestamp).format(
                          "YYYY-MM-DD hh:mm:ss"
                        )}
                      </View>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <View>玩家列表:</View>
                    </Col>
                    <Col span={16}>
                      {item.gameResult.players.map((player, playerIndex) => (
                        <View key={playerIndex}>
                          玩家{playerIndex + 1}: {player.username} - 分数:{" "}
                          {player.score}
                        </View>
                      ))}
                    </Col>
                  </Row>
                </>
              );
            })
          ) : (
            <View>暂无对局记录</View>
          )}
        </View>
      </ScrollView>
    </Popup>
  );
};

export default History;
