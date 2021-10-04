import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const GoBackButton = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          style={{marginRight: 25}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GoBackButton;

const styles = StyleSheet.create({});
