import React, { useState } from 'react';
import { Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';

export default function ProfileMenuButton() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    closeMenu();
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  const handleProfile = () => {
    closeMenu();
    navigation.navigate('Profile' as never);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton icon="account-circle" size={28} onPress={openMenu} />}
    >
      <Menu.Item onPress={handleProfile} title="Profile" />
      <Menu.Item
        onPress={handleLogout}
        title="Log Out"
        titleStyle={{ color: 'red', fontWeight: 'bold' }}
      />
    </Menu>
  );
}
