import React from 'react';
import { Image, Platform, View, StyleSheet, ScrollView, TextInput, CheckBox, TouchableOpacity } from 'react-native';
import LogoTitle from "../components/LogoTitle";
import Ionicons from "react-native-vector-icons/Ionicons";


import { Container, Header, Content, List, ListItem, Text, Separator, Right} from 'native-base';
import * as firebase from "firebase";
import config from '../config';

class PanierScreen extends React.Component {
    constructor(props) {
        super(props);
        if(!firebase.apps.length){
            firebase.initializeApp(config);
        }
    }

    state = {
        ingredients: [],
        loading: true
    };

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        developmentModeText: {
            marginBottom: 20,
            color: 'rgba(0,0,0,0.4)',
            fontSize: 14,
            lineHeight: 19,
            textAlign: 'center',
        },
        contentContainer: {
            paddingTop: 30,
        },
        welcomeContainer: {
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20,
        },
        welcomeImage: {
            width: 100,
            height: 80,
            resizeMode: 'contain',
            marginTop: 3,
            marginLeft: -10,
        },
        getStartedContainer: {
            alignItems: 'center',
            marginHorizontal: 50,
        },
        homeScreenFilename: {
            marginVertical: 7,
        },
        codeHighlightText: {
            color: 'rgba(96,100,109, 0.8)',
            fontSize: 24,
        },
        codeHighlightContainer: {
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 3,
            paddingHorizontal: 4,
        },
        getStartedText: {
            fontSize: 17,
            color: 'rgba(96,100,109, 1)',
            lineHeight: 24,
            textAlign: 'center',
        },
        tabBarInfoContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            ...Platform.select({
                ios: {
                    shadowColor: 'black',
                    shadowOffset: {height: -3},
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                android: {
                    elevation: 20,
                },
            }),
            alignItems: 'center',
            backgroundColor: '#fbfbfb',
            paddingVertical: 20,
        },
        tabBarInfoText: {
            fontSize: 17,
            color: 'rgba(96,100,109, 1)',
            textAlign: 'center',
        },
        navigationFilename: {
            marginTop: 5,
        },
        helpContainer: {
            marginTop: 15,
            alignItems: 'center',
        },
        helpLink: {
            paddingVertical: 15,
        },
        helpLinkText: {
            fontSize: 14,
            color: '#2e78b7',
        },
    });

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            title: "Listes d'achat",
            /* These values are used instead of the shared configuration! */
            headerStyle: {
                //backgroundColor: navigationOptions.headerTintColor,
                backgroundColor: "#FFF9C5"
            },
            headerTintColor: "#ED125E",//navigationOptions.headerStyle.backgroundColor,
        };
    };

    componentWillMount() {
        this.props.navigation.setParams({ increaseCount: this._increaseCount });
        const ref = firebase.database().ref('Panier/');
        ref.on('value', snapshot => {
            let data = snapshot.val();
            this.setState({
                ingredients: data,
                loading: false
            });
        });
    }


    render() {

        let ingredientsPanier = this.state.ingredients.map( subarray => subarray.map(item =>
            <ListItem>

                <Text style={{textAlign: 'left', marginBottom: 10, flex: 4}}>
                    - {item.ingredient}
                </Text>
                <TouchableOpacity
                    onPress={() => console.log(" "+item.id)}
                    style={{ paddingLeft: 25, paddingRight: 15 }}
                >

                    <Ionicons
                        name="ios-trash"
                        color={'#ED125E'}
                        size={30}
                    />


                </TouchableOpacity>
            </ListItem>


        ));



        if(!this.state.loading) {
            return (
                <ScrollView>
                    <Container>
                        <Content>
                            {ingredientsPanier}
                        </Content>
                    </Container>
                </ScrollView>

            );
        }
        else {
            return(
                <ScrollView style={this.styles.container} contentContainerStyle={this.styles.contentContainer}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Container>

                            <Text>
                                Chargement
                            </Text>


                        </Container>
                    </View>
                </ScrollView>
            );
        }
    }
}
export default PanierScreen;