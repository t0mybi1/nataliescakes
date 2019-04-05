import React from 'react';
import { Button, Image, Platform, View, Text, StyleSheet, ScrollView } from 'react-native';
import { List, SearchBar } from 'react-native-elements';




class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require('../assets/images/spiro.png')}
                style={{width: 350, height: 100}}
            />
        );
    }
}
export default LogoTitle;