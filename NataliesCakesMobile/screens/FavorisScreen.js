import React from 'react';
import {Image, Platform, View, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import LogoTitle from "../components/LogoTitle";

import { SearchBar } from 'react-native-elements';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';

import * as firebase from "firebase";
import config from '../config';
import Ionicons from "react-native-vector-icons/Ionicons";

class FavorisScreen extends React.Component {
    constructor(props) {
        super(props);
        if(!firebase.apps.length){
            firebase.initializeApp(config);
        }
    }

    state = {
        recettes: [],
        recettesBaseSearch: [],
        search: '',
        img: [
            {
                nom: '',
                url: '',
                status: 'done',
                uid: '-1'
            }
        ],
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
        searchBar: {
            width: 240,
            height: 40,
            paddingLeft: 10,
            alignSelf: 'center',
            borderWidth: 2,
            borderColor: 'black',
            marginTop: 20,
        },
    });

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            title: "Favoris",
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
        const ref = firebase.database().ref('Favoris/');
        ref.on('value', snapshot => {
            let data = snapshot.val();
            let test = Object.values(data);
            this.setState({
                recettes: test,
                recettesBaseSearch: test,
                loading: false
            });
            // console.log(this.state.recettes)
        });
    }

    updateSearch = (value) => {
        var valueSearched = value.nativeEvent.text;

        this.setState({ search: valueSearched });
        var listSearched = this.state.recettes.filter(item => item.nom.toLowerCase() === valueSearched.toLowerCase());

        if(listSearched.length === 0) {
            listSearched = this.state.recettes.filter(item => item.nom.toLowerCase().match(valueSearched.toLowerCase()));
        }

        if(valueSearched === "") {
            this.setState({
                recettes: this.state.recettesBaseSearch
            });
        }
        else {
            this.setState({
                recettes: listSearched
            });
        }
    };

    _increaseCount = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {


        let recettesFav = this.state.recettes.map((recette) => (
            <Content>
                <List>
                    <ListItem thumbnail >
                        <Left >
                            <Image source={{uri: recette.images[0].thumbUrl}} style={{height: 50, width: 50, borderRadius: 25}}/>
                        </Left>
                        <Body>
                        <Text style={{color: "#ED125E"}}>{recette.nom}</Text>
                        <Text note numberOfLines={1}>{recette.commentaire}</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.props.navigation.navigate('Details', {
                                    itemId: recette.id,
                                    title: recette.nom,
                                    isFavoris: true
                                });
                            }}>
                                <Ionicons
                                    name="ios-eye"
                                    color={'#ED125E'}
                                    size={30}
                                />
                            </Button>
                        </Right>
                    </ListItem>

                </List>
            </Content>
        ));



        if(!this.state.loading) {
            return (
                <Content>
                    <List>
                    <View style={this.styles.searchBar}>
                        <TextInput style={this.styles.inputSrch} type = "text" value = {this.state.search} onChange = {this.updateSearch} placeholder = "Recherche ..." />
                    </View>
                        {recettesFav}

                    </List>
                </Content>

            );
        }
        else {
            return(
                <Content>
                    <List>
                    <View style={this.styles.searchBar}>
                        <TextInput style={this.styles.inputSrch} type = "text" value = {this.state.search} onChange = {this.updateSearch} placeholder = "Recherche ..." />
                    </View>
                      <ListItem>
                          <Body>
                          <Text>Chargement...</Text>
                          </Body>
                      </ListItem>

                    </List>
                </Content>
            );
        }
    }
}
export default FavorisScreen;