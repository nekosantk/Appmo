import React from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddContactPanel = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.Container}
        onPress={() => console.log('TODO: Open phone contacts')}>
        <MaterialIcons
          name="person-add"
          size={30}
          color="black"
          style={styles.Icon}
        />
        <Text style={styles.Label}>New Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddContactPanel;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 55,
  },
  Icon: {
    alignSelf: 'flex-start',
    left: 13,
    borderRadius: 10,
    backgroundColor: '#99AAAB',
    height: 35,
    width: 35,
  },
  Label: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 65,
    fontWeight: '800',
  },
});
