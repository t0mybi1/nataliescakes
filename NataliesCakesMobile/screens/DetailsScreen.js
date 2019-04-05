import React from 'react';
import { Button, Image, Platform, View, Text, StyleSheet, ScrollView,   TouchableOpacity, } from 'react-native';

import { List, SearchBar } from 'react-native-elements';

import {Card, Icon, Divider} from "react-native-elements";
import Slideshow from 'react-native-image-slider-show';
import showMessage from "react-native-flash-message";
import db from "../config";
import * as firebase from "firebase";
import {Body, CardItem, Left, Thumbnail} from "native-base";

class DetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.addToFav = this.addToFav.bind(this);
        this.deleteToFav = this.deleteToFav.bind(this);
        this.addToListAchat = this.addToListAchat.bind(this);
    }

    state = {
        recettes: [],
        loading: true,
        id : this.props.navigation.state.params.itemId,
        isFavoris : this.props.navigation.state.params.isFavoris !== undefined ? this.props.navigation.state.params.isFavoris : false,
        tags: [],
        ingredients: [],
        materiels: [],
        images: [],
        preparation: [],
        panier: [],
    };

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.title : null,
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
        const ref = firebase.database().ref('Recettes/'+this.state.id);
        ref.on('value', snapshot => {
            let data = snapshot.val();
            this.setState({
                recettes: data,
                tags: data.tags,
                ingredients: data.ingrédients,
                materiels: data.materiel,
                images: data.images,
                preparation: data.préparation,
                loading: false
            });
        });
    }

    addToFav() {
        var data =
            {   "commentaire": this.state.recettes.commentaire,
                "difficulté": this.state.recettes.difficulté,
                "id": parseInt(this.state.recettes.id),
                "images": this.state.images,
                "ingrédients":this.state.ingredients,
                "materiel": this.state.materiels,
                "nb_pers": this.state.recettes.nb_pers,
                "nom":this.state.recettes.nom,
                "préparation": this.state.preparation,
                "tags":this.state.tags,
                "temps_cuisson": this.state.recettes.temps_cuisson,
                "temps_prep": this.state.recettes.temps_prep,
                "type": this.state.recettes.type
            };
        const add = firebase.database().ref('Favoris/'+this.state.recettes.id);
        add.set(data);/*.then(() => {
            showMessage({
                message: "Simple message",
                type: "info",
              }); // Succès !
            }, () => {
                showMessage({
                    message: "Simple message",
                    type: "info",
                  }); // Erreur !
          });*/
    }

    deleteToFav() {
        return firebase.database().ref('Favoris/').child(this.state.recettes.id).remove();
    }

    addToListAchat() {
       /*var data = this.state.ingredients;
        console.log(data);
        const add = firebase.database().ref('Panier/');
        //add.set(data);*/
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 10
        },
        button: {
            alignItems: 'center',
            backgroundColor: '#ED125E',
            color: '#FFFFFF',
            padding: 10,
            borderRadius: 23,
            height: 46,
            justifyContent: 'center'
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
        titleCard:{
            fontSize: 16,
            color: "#ED125E"
        }
    });



    render() {
        /* 2. Read the params from the navigation state */
        const { params } = this.props.navigation.state;

        if(!this.state.loading){
            return (
                <ScrollView style={this.styles.container} contentContainerStyle={this.styles.contentContainer}>
                    <Slideshow
                        dataSource={
                            [
                                {   title : "Difficulté : "+this.state.recettes.difficulté,
                                    url: this.state.images[0].thumbUrl
                                },
                                this.state.images.length > 1 ? {url: this.state.images[1].thumbUrl} : {}
                            ]
                        }
                    />


                    <Card style={{marginTop: 10}}
                          title= "Informations">
                        <Text style={{textAlign: 'left', marginBottom: 10}}>
                            <Image
                                source={require('../assets/images/gateau_parts.png')}
                                style={{width: 50, height: 50}}
                            />
                            {this.state.recettes.nb_pers}
                        </Text>
                        <Text style={{textAlign: 'left', marginBottom: 10}}>
                            <Image
                                source={require('../assets/images/four.png')}
                                style={{width: 40, height: 40}}
                            />
                            {this.state.recettes.temps_cuisson > 60 ?
                                (this.state.recettes.temps_cuisson - (this.state.recettes.temps_cuisson%60)/60) +"h"+this.state.recettes.temps_cuisson%60+"minutes"
                                :
                                this.state.recettes.temps_cuisson === 60 ? "1h"
                                    :
                                    this.state.recettes.temps_cuisson
                            }
                        </Text>
                        <Text style={{textAlign: 'left', marginBottom: 10}}>
                            <Image
                                source={require('../assets/images/meal.png')}
                                style={{width: 40, height: 40}}
                            />
                            {this.state.recettes.temps_prep > 60 ?
                                (this.state.recettes.temps_prep - (this.state.recettes.temps_prep%60)/60) +"h"+this.state.recettes.temps_prep%60+"minutes"
                                :
                                this.state.recettes.temps_prep === 60 ? "1h"
                                    :
                                    this.state.recettes.temps_prep
                            }
                        </Text>
                    </Card>

                    <Card>
                        <CardItem header bordered>
                            <Image
                                source={require('../assets/images/ustensiles.png')}
                                style={{width: 50, height: 50}}
                            />
                            <Text allowFontScaling={false}>
                                Materiels
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            {this.state.materiels.map((materiel) => (
                                <Text allowFontScaling={false} style={{ marginTop: 5, marginBottom: 5}}>
                                    • {materiel}
                                </Text>))}
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header bordered>
                            <Image
                                source={require('../assets/images/recipe-book.png')}
                                style={{width: 50, height: 50}}
                            />
                            <Text allowFontScaling={false}>
                                Ingrédients
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            {this.state.ingredients.map((ingredient) => (
                                <Text allowFontScaling={false} style={{ marginTop: 5, marginBottom: 5}}>
                                    • {ingredient}
                                </Text>))}
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header bordered>
                            <Image
                                source={require('../assets/images/ustensiles.png')}
                                style={{width: 50, height: 50}}
                            />
                            <Text allowFontScaling={false}>
                                Préparation
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            {this.state.preparation.map((prep) => (
                                <Text style={{textAlign: 'center', marginBottom: 10}}>
                                    - {prep}
                                </Text>
                            ))}
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem header bordered>
                            <Image
                                source={require('../assets/images/ustensiles.png')}
                                style={{width: 50, height: 50}}
                            />
                            <Text allowFontScaling={false}>
                                Commentaire / Astuce
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{textAlign: 'center', marginBottom: 10}}>
                                {this.state.recettes.commentaire}
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header bordered>
                            <Image
                                source={require('../assets/images/tag.png')}
                                style={{width: 50, height: 50}}
                            />
                            <Text allowFontScaling={false}
                            >
                                Tags
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            {this.state.tags.map((tag) => (
                                <Text allowFontScaling={false} style={{ marginTop: 5, marginBottom: 5}}>
                                    • {tag}
                                </Text>))}
                            </Body>
                        </CardItem>
                    </Card>

                    <View style={this.styles.container}>
                        {!this.props.navigation.state.params.isFavoris ?
                            <TouchableOpacity
                                style={this.styles.button}
                                onPress={this.addToFav}
                            >
                                <Text style={{color: "#FFFFFF"}}> Ajouter aux favoris </Text>

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={this.styles.button}
                                onPress={this.deleteToFav}
                            >
                                <Text style={{color: "#FFFFFF"}}> Retirer des favoris </Text>

                            </TouchableOpacity>
                        }
                    </View>

                    <View style={this.styles.container}>
                        <TouchableOpacity
                            style={this.styles.button}
                            onPress={this.addToListAchat}
                        >
                            <Text style={{color: "#FFFFFF"}}> Ajouter a la liste d'achat </Text>

                        </TouchableOpacity>
                    </View>

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
export default DetailsScreen;