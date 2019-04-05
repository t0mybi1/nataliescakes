import React from 'react';
import { Button, Image, Platform, View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import {Body, CardItem, Left, Right, Thumbnail, Card, Icon} from "native-base";

import { List, SearchBar, ListItem } from 'react-native-elements';

import * as firebase from "firebase";
import config from '../config';

class TagsScreen extends React.Component {


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
            paddingTop: 0,
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

      state = {
        recettes: [],
        tags: [],
        tagsBaseSearch: [],
        loading: true,
        search: ''
    };

    constructor(props) {
        super(props);
        this.updateSearch = this.updateSearch.bind(this);
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            title: "Tags",
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
        const ref = firebase.database().ref('Recettes/');
        ref.on('value', snapshot => {
            let data = snapshot.val();
            let allTags = [];
            let finalTags = [];

            data.map((recette) => (recette.tags.map((tag) => allTags.push(tag))));
            tagsFiltered = allTags.filter(function(elem, pos) {
                return allTags.indexOf(elem) == pos;
            });
            
            for(var i =0; i<tagsFiltered.length; i++){
                var count = 0;
                for(var x = 0; x<allTags.length; x++) {
                    if(allTags[x] === tagsFiltered[i]){
                        count++;
                    }
                }
                finalTags[i] = {
                        nom: tagsFiltered[i],
                        nb: count
                }
            }
            this.setState({
                recettes: data,
                tags: finalTags,
                tagsBaseSearch: finalTags,
                loading: false
            })
        });
    }

    updateSearch = (value) => {
        var valueSearched = value.nativeEvent.text;
        this.setState({ search: valueSearched });
        var listSearched = this.state.tags.filter(item => item.nom.toLowerCase() === valueSearched.toLowerCase());

        if(listSearched.length === 0) {
            listSearched = this.state.tags.filter(item => item.nom.toLowerCase().match(valueSearched.toLowerCase()));
        }

        if(valueSearched === "") {
            this.setState({
                tags: this.state.tagsBaseSearch
            });
        }
        else {
            this.setState({
                tags: listSearched
            });
        }
    };


    render() {

        if(!this.state.loading){
            return (
                <ScrollView style={this.styles.container} contentContainerStyle={this.styles.contentContainer}>
                    <View style={this.styles.searchBar}>
                        <TextInput style={this.styles.inputSrch} type = "text" value = {this.state.search} onChange = {this.updateSearch} placeholder = "Recherche ..." />
                    </View>
                    <View>
                    {
                        this.state.tags.map((item, i) => (
                            <ListItem
                                key={i}
                                title={item.nom}
                                titleStyle={{ color: '#ED125E', fontWeight: 'bold', textAlign: 'center' }}
                                badge={{ value: item.nb > 1 ? item.nb + " recettes" : item.nb + " recette", textStyle: { color: '#ED125E' }, badgeStyle:{backgroundColor: "#FFF9C5"}}}
                                chevronColor="#ED125E"
                                chevron
                                onPress={() => {
                                    console.log(item.nom);
                                    /* 1. Navigate to the Details route with params */
                                    this.props.navigation.navigate('RecettesByTags', {
                                        tag: item.nom
                                    });
                                }}
                            />
                        ))
                    }
                    </View>
                </ScrollView>
            );
        }
        else {
            return (
                <ScrollView style={this.styles.container} contentContainerStyle={this.styles.contentContainer}>
                    <View style={this.styles.searchBar}>
                        <TextInput style={this.styles.inputSrch} type = "text" value = {this.state.search} onChange = {this.updateSearch} placeholder = "Recherche ..." />
                    </View>
                </ScrollView>
            );
        }
    }
}
export default TagsScreen;