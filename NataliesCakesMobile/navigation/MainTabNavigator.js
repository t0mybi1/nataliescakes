import React from 'react';
import { Platform } from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer} from 'react-navigation';

import HomeNavigator from './HomeNavigator'
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';

import DetailsScreen from "../screens/DetailsScreen";
import TagsScreen from "../screens/TagsScreen";
import FavorisNavigator from "./FavorisNavigator";
import FavorisScreen from "../screens/FavorisScreen";
import PanierScreen from "../screens/PanierScreen";
import TagsNavigator from "./TagsNavigator";

const HomeStack = createStackNavigator({
        Home : HomeNavigator,
},
    {
      headerMode: "none",
    }
);

HomeStack.navigationOptions = {

    tabBarLabel: 'Accueil',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),


};

const FavorisStack = createStackNavigator({
        Favoris : FavorisNavigator,
    },
    {
        headerMode: "none",
    }
);

FavorisStack.navigationOptions = {

    tabBarLabel: 'Favoris',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-star`
                    : 'md-star'
            }
        />

    ),


};

const DetailsStack = createStackNavigator({
    Details: DetailsScreen,
});

DetailsStack.navigationOptions = {
    tabBarLabel: 'Details',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
        />
    ),
};

const TagsStack = createStackNavigator({
    Tags: TagsNavigator,
},{
    headerMode: "none",
});

TagsStack.navigationOptions = {
    tabBarLabel: 'Tags',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
        />
    ),
};

const PanierStack = createStackNavigator({
    Panier: PanierScreen,
});

PanierStack.navigationOptions = {
    tabBarLabel: 'Panier',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
        />
    ),
};




const RootStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Favoris: {
            screen: FavorisScreen,
        },
        Tags: {
            screen: TagsScreen,
        },
        Panier: {
            screen: PanierScreen,
        },


    },

);
const AppContainer = createAppContainer(RootStack);

export default createBottomTabNavigator({
  HomeStack,
    FavorisStack,
  TagsStack,
    PanierStack
});
