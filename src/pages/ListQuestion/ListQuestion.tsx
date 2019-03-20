import React from 'react';
import { ScrollView, View, FlatList, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { NavigationInjectedProps } from 'react-navigation';
import Question from '../../interfaces/Question';
import { Header, Button, ListItem, Image } from 'react-native-elements';

interface IProps extends NavigationInjectedProps {

}

interface IState {
    questions: Question[];
}

export default class ListQuestion extends React.Component<IProps, IState> {
    static navigationOptions = { header: null };

    constructor(props: IProps) {
        super(props);

        this.state = {
            questions: [],
        }
    }

    componentWillMount() {
        firebase.database().ref('/faq').on('value', async (snapshot) => {
            let data = snapshot.val();
            if (data) {
                let questions: Question[] = [];
                await Object.keys(data).forEach(key => {
                    questions.push({
                        id: key,
                        email: data[key].email,
                        question: data[key].question,
                        response: data[key].response,
                        visibleOnWeb: data[key].visibleOnWeb,
                    });
                });
                await this.setState({ questions });
            }
        });
    }

    gotToQuestion = (question: Question) => {
        this.props.navigation.navigate('FAQ', { question });
    }

    render() {
        return (
            <View>
                <Header
                    containerStyle={{ height: Platform.OS === 'ios' ? 70 : 70 - 24 }}
                    leftComponent={
                        <Button
                            type="clear"
                            icon={{
                                name: "chevron-left",
                                iconStyle: { color: "#FFF" },
                                containerStyle: { marginBottom: 25 }
                            }}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    }
                    centerComponent={{ text: 'QUESTIONS', style: { color: "#FFF", marginBottom: 24 } }}
                />
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.questions.length > 0 ? (
                            this.state.questions.map((question, index) => {
                                let itemStyle = styles.item;
                                if (question.question) {
                                    if (question.response) itemStyle = { ...itemStyle, ...styles.newMessage };
                                    return (
                                        <ListItem
                                            key={index}
                                            title={<Text numberOfLines={1} style={{ fontWeight: 'bold', }}>{question.question}</Text>}
                                            subtitle={question.email ? <Text style={{ fontSize: 10 }}>{question.email}</Text> : null}
                                            leftAvatar={{
                                                source: {
                                                    uri: 'https://source.unsplash.com/random/100x100',
                                                }
                                            }}
                                            onPress={() => this.gotToQuestion(question)}
                                            chevron
                                        />
                                    )
                                }
                                return <></>;
                            })
                        ) : (
                                <Image source={{ uri: "https://source.unsplash.com/random/200x200" }} style={{ height: 200, width: 200, marginTop: 100, marginLeft: 80 }} />
                            )}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    user: {
        flex: 1,
        fontSize: 25,
        marginBottom: 15,
        alignContent: 'center',
        justifyContent: 'center',
    },
    item: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        backgroundColor: "#E7E7E7",
        padding: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    newMessage: {
        backgroundColor: "#08ad10",
    }
});
