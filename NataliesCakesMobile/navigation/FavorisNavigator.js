import {createStackNavigator} from "react-navigation";
import DetailsScreen from "../screens/DetailsScreen";
import FavorisScreen from "../screens/FavorisScreen";

export default FavorisNavigator = createStackNavigator(
    {
        Favoris: FavorisScreen,
        Details: DetailsScreen
    },
    {
        initialRouteName: "Favoris"
    }
);
