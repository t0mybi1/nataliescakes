import {createStackNavigator} from "react-navigation";
import TagsScreen from "../screens/TagsScreen";
import RecettesByTagsScreen from "../screens/RecettesByTagsScreen";
import DetailsScreen from "../screens/DetailsScreen";

export default TagsNavigator = createStackNavigator(
    {
        Tags: TagsScreen,
        RecettesByTags: RecettesByTagsScreen,
        Details: DetailsScreen
    },
    {
        initialRouteName: "Tags"
    }
);
