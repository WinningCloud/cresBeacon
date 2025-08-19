import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const profileOptions = [
  { id: '1', title: 'My Reports', icon: <MaterialIcons name="description" size={24} color="black" />, screen: 'MyReports' },
  { id: '2', title: 'Saved Resources / Awareness', icon: <Ionicons name="bookmark" size={24} color="black" />, screen: 'SavedResources' },
  { id: '3', title: 'Counselor / Help Connect', icon: <FontAwesome5 name="user-friends" size={24} color="black" />, screen: 'CounselorConnect' },
  { id: '4', title: 'Settings', icon: <Ionicons name="settings-outline" size={24} color="black" />, screen: 'Settings' },
  { id: '5', title: 'Account Info', icon: <Ionicons name="person-outline" size={24} color="black" />, screen: 'AccountInfo' },
  { id: '6', title: 'Logout / Exit', icon: <Ionicons name="arrow-back-outline" size={24} color="black" />, screen: 'Logout' },
];

export default function Profile() {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    // Navigate to the corresponding screen
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 15, marginBottom: 10,marginTop:30, textAlign:'center',  }}>Profile Options</Text>
      <FlatList
        data={profileOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => handlePress(item.screen)}>
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f9f4f6',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  separator: {
    height: 10,
  },
});
