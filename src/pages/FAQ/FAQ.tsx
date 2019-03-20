import React from 'react';
import { ScrollView, View, StyleSheet, Platform, Switch, TextInput } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import Question from '../../interfaces/Question';
import { anwserQuestion } from '../../controllers/questions';
import { Header, Button, Text, Input } from 'react-native-elements';

interface IProps extends NavigationInjectedProps {

}

interface IState extends Question {
    loading: boolean;
}

export default class Chat extends React.Component<IProps, IState>{
    static navigationOptions = { header: null };

    constructor(props: IProps) {
        super(props);

        const question: Question = props.navigation.getParam('question');

        this.state = {
            loading: false,
            question: question.question || '',
            visibleOnWeb: question.visibleOnWeb,
            response: question.response || '',
            email: question.email || '',
            id: question.id || '',
        }
    }

    render() {
        const { question } = this.state;

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
                    rightComponent={
                        <Switch
                            value={this.state.visibleOnWeb}
                            onValueChange={state => this.setState({ visibleOnWeb: state })}
                            style={{ marginBottom: 25 }}
                        />
                    }
                />
                <ScrollView>
                    <View style={styles.container}>
                        <Text h3>Question</Text>
                        <Text>{question}</Text>

                        <Text h3>Response</Text>
                        <TextInput
                            multiline={true}
                            onChangeText={(text) => this.setState({ response: text })}
                            value={this.state.response}
                            style={styles.textArea} />

                        <Button title="Envoyer" onPress={this.handleSubmit} disabled={this.state.response.length === 0} loading={this.state.loading} />
                    </View>
                </ScrollView>
            </View>
        )
    }

    handleSubmit = async () => {
        this.setState({ loading: true });
        const { id, email, question, response, visibleOnWeb } = this.state;
        try {
            await anwserQuestion({
                id,
                email,
                response,
                question,
                visibleOnWeb,
            });
            this.props.navigation.navigate('ListQuestion');
        } catch{ }
        this.setState({ loading: false });
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    content: {
        padding: 15,
    },
    header: {
        fontSize: 25,
    },
    switch: {
        alignSelf: 'flex-end',
    },
    textArea: {
        borderWidth: 1,
        marginBottom: 5,
    }
});
