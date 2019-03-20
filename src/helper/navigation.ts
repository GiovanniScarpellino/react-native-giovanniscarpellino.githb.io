import { StackActions, NavigationActions, NavigationNavigateActionPayload } from "react-navigation";

export const clearNavigationHistory = (routeName: string, params?: any) => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName, params, } )],
    });
    return resetAction;
}