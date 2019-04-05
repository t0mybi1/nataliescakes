import React from 'react';
import { Image, Platform, View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { List, SearchBar } from 'react-native-elements';
import LogoTitle from "../components/LogoTitle";


import {Body, CardItem, Left, Right, Thumbnail, Card, Text, Button, Icon} from "native-base";

import * as firebase from "firebase";
import config from '../config';

class HomeScreen extends React.Component {
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

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerStyle: {
                height: 150,
                backgroundColor: '#FFF9C5'
            }
        };
    };

    componentWillMount() {
        this.props.navigation.setParams({ increaseCount: this._increaseCount });
        const ref = firebase.database().ref('Recettes/');
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


        let recettesCard = this.state.recettes.map((recette) => (
            <Card>
                <CardItem header button onPress={() => alert("This is Card Header")}>
                    <Left>
                        <Thumbnail style={{width: 40, height: 45}} source={require("../assets/images/baker.png")} />
                        <Body>
                        <Text style={{color: "#ED125E", fontSize: 20  }}>{recette.nom}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody button
                          onPress={() => {
                              this.props.navigation.navigate('Details', {
                                  itemId: recette.id,
                                  title: recette.nom
                              });
                          }}>
                    <Image source={{uri: recette.images[0].thumbUrl}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Body>
                    <Button
                        onPress={() => {
                            /* 1. Navigate to the Details route with params */
                            this.props.navigation.navigate('Details', {
                                itemId: recette.id,
                                title: recette.nom
                            });
                        }}
                        style={{backgroundColor: "#ED125E", width: "100%", justifyContent: 'center'}}

                    >
                        <Text>Voir plus..</Text>
                    </Button>
                    </Body>
                </CardItem>
            </Card>
        ));

/*
<SearchBar
                        lightTheme
                        style={{color: "white"}}
                        placeholder="Recherche ..."
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                    />*/

        if(!this.state.loading) {
            return (
                <ScrollView>
                    <View style={this.styles.searchBar}>
                        <TextInput style={this.styles.inputSrch} type = "text" value = {this.state.search} onChange = {this.updateSearch} placeholder = "Recherche ..." />
                    </View>
                    
                    {recettesCard}
                    <Button
                        title="Afficher les tags"
                        onPress={() => {
                            /* 1. Navigate to the Details route with params */
                            this.props.navigation.navigate('Tags', {
                                itemId: 86,
                                title: 'Tags',
                            });
                        }}
                    />

                </ScrollView>

            );
        }
        else {
            return(
                <ScrollView style={this.styles.container} contentContainerStyle={this.styles.contentContainer}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Card
                            title='Chargement'>
                        </Card>

                    </View>
                </ScrollView>
            );
        }
    }
}
export default HomeScreen;