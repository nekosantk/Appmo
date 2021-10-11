import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ChatBubble = ({text, senderID, timestamp, myID}) => {
  if (senderID == myID) {
    return (
      <View style={styles.recievedContainer} key={timestamp}>
        <Text style={{fontSize: 16, color: '#fff'}} key={timestamp}>
          {text}
        </Text>
        <View style={styles.rightArrow}></View>
        <View style={styles.rightArrowOverlap}></View>
      </View>
    );
  } else {
    return (
      <View style={styles.sentContainer} key={timestamp}>
        <Text style={{fontSize: 16, color: '#000', justifyContent: 'center'}} key={timestamp}>
          {text}
        </Text>
        <View style={styles.leftArrow}></View>
        <View style={styles.leftArrowOverlap}></View>
      </View>
    );
  }
};

export default ChatBubble;

const styles = StyleSheet.create({
  recievedContainer: {
    backgroundColor: '#0078fe',
    padding: 10,
    marginLeft: '25%',
    borderRadius: 5,
    marginTop: 5,
    marginRight: '5%',
    maxWidth: '100%',
    alignSelf: 'flex-end',
    borderRadius: 20,
  },
  sentContainer: {
    backgroundColor: '#dedede',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: '5%',
    maxWidth: '100%',
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#0078fe',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -19.5,
  },
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -19.5,
  },
});
