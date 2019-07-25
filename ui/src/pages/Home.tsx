import * as React from 'react';
import styled from 'styled-components';
import {RouteComponentProps} from 'react-router';
import {Button, TextArea} from '@allenai/varnish/components';

import {Loading, Error, Checker, HelpWidget} from '../components';
import {solve, Result} from '../api';

/**
 * We use a state machine to capture the current state of the view. Since
 * there's a form it might be empty, loading, displaying an answer or
 * giving the user feedback about an error.
 *
 * Feel free to preserve this constructor, or roll your own solution. Do
 * what works best for your use case!
 */
enum View {
    INPUT, RESULT, ERROR
}

/**
 * The home page has a form, which requires the preservation of state in
 * memory. The links below contain more information about component state
 * and managed forms in React:
 *
 * @see https://reactjs.org/docs/state-and-lifecycle.html
 * @see https://reactjs.org/docs/forms.html
 *
 * Only use state when necessary, as in-memory representaions add a bit of
 * complexity to your UI.
 */
interface State {
    query: string,
    view: View,
    result?: Result,
    error?: string
};

export default class Home extends React.PureComponent<RouteComponentProps, State> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            // query: Query.fromQueryString(props.location),
            query: '',
            view: View.INPUT
        };
        // this.dostuff = this.dostuff.bind(this);
        this.fetchEmpties=this.fetchEmpties.bind(this);
        this.onFocusText=this.onFocusText.bind(this);
        this.generateSentence=this.generateSentence.bind(this);
    }

    /**
     * Returns whether there is an answer and whether that answer is for
     * the current query.
     *
     * @returns {boolean}
     */
    hasAnswerForCurrentQuery() {
        return true;
        // return (
        //     this.state.result &&
        //     this.state.result.query.equals(this.state.query)
        // );
    }

    /**
     * Submits an API query for an answer for the current query.
     *
     * @returns {void}
     */
    fetchEmpties(txt:string) {
        // We store a local variable capturing the value of the current
        // query. We use this as a semaphore / lock of sorts, since the
        // API query is asynchronous.
        // const originalQuery = this.state.query;
        this.setState({ view: View.RESULT, query:txt,result:undefined }, () => {
            solve(this.state.query)
                .then(result => {
                    // When the API returns successfully we make sure that
                    // the returned answer is for the last submitted query.
                    // This way we avoid displaying an answer that's not
                    // associated with the last query the user submitted.
                    if (this.state.query === txt) {
                        this.setState({
                            view: View.RESULT,
                            error: undefined,
                            result
                        });
                    }
                })
                .catch(err => {
                    // Again, make sure that the error is associated with the
                    // last submitted query.
                    if (this.state.query === txt) {
                        let error;
                        if (err.response &&
                            err.response.data &&
                            err.response.data.error) {
                            error = err.response.data.error;
                        } else {
                            error = 'Something went wrong. Please try again.';
                        }
                        this.setState({
                            view: View.ERROR,
                            result: undefined,
                            error
                        });
                    }
                });
        })
    }

    /**
     * This handler updates the query whenever the user changes the question
     * text. It's bound to the question input's `onChange` handler in the
     * `render` method below.
     *
     * @see https://reactjs.org/docs/forms.html
     */
    // handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     const value = event.target.value;
    //     this.setState(state => ({
    //         query: new Query(value, state.query.choices)
    //     }));
    // };
    // /**
    //  * This handler updates the query whenever the user changes the first
    //  * answer text. It's bound to the answer input's `onChange` handler in the
    //  * `render` method below.
    //  *
    //  * @see https://reactjs.org/docs/forms.html
    //  */
    // handleFirstAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     const value = event.target.value;
    //     this.setState(state => ({
    //         query: new Query(state.query.question, [
    //             value,
    //             state.query.choices[1]
    //         ])
    //     }));
    // }
    /**
     * This handler updates the query whenever the user changes the second
     * answer text. It's bound to the answer input's `onChange` handler in the
     * `render` method below.
     *
     * @see https://reactjs.org/docs/forms.html
     */
    // handleSecondAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     const value = event.target.value;
    //     this.setState(state => ({
    //         query: new Query(state.query.question, [
    //             state.query.choices[0],
    //             value
    //         ])
    //     }));
    // }
    /**
     * This handler is invoked when the form is submitted, which occurs when
     * the user clicks the submit button or when the user clicks input while
     * the button and/or a form element is selected.
     *
     * We use this instead of a onClick button on a button as it matches the
     * traditional form experience that end users expect.
     *
     * @see https://reactjs.org/docs/forms.html
     */
    // handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     // By default, HTML forms make a request back to the server. We
    //     // prevent that and instead submit the request asynchronously.
    //     event.preventDefault();
    //
    //     // We add the query params to the URL, so that users can link to
    //     // our demo and share noteworthy cases, edge cases, etc.
    //     this.props.history.push(`/?${this.state.query.toQueryString()}`);
    //
    //     // Query the answer and display the result.
    //     this.fetchAnswer();
    // }
    /**
     * This is a lifecycle function that's called by React after the component
     * has first been rendered.
     *
     * We use it here to fetch an answer if the url parameters include a fully
     * defined query.
     *
     * You can read more about React component's lifecycle here:
     * @see https://reactjs.org/docs/state-and-lifecycle.html
     */
    componentDidMount() {
        // if (
        //     this.state.query.isValid() &&
        //     !this.hasAnswerForCurrentQuery()
        // ) {
        //     this.fetchAnswer();
        // }
    }



    /**
     * The render method defines what's rendered. When writing yours keep in
     * mind that you should try to make it a "pure" function of the component's
     * props and state.  In other words, the rendered output should be expressed
     * as a function of the component properties and state.
     *
     * React executes render whenever a component's properties and/or state is
     * updated. The output is then compared with what's rendered and the
     * required updates are made. This is to ensure that rerenders make as few
     * changes to the document as possible -- which can be an expensive process
     * and lead to slow interfaces.
     */
    handleQuerySubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode == 13) {
            let value = (event.target as HTMLInputElement).value;
            // console.log(value);

            this.fetchEmpties(value);
             (event.target as HTMLInputElement).blur()

        }
        // By default, HTML forms make a request back to the server. We
        // // prevent that and instead submit the request asynchronously.
        // event.preventDefault();
        //
        // // We add the query params to the URL, so that users can link to
        // // our demo and share noteworthy cases, edge cases, etc.
        // // this.props.history.push(`/?${this.state.query.toQueryString()}`);
        //
        // // Query the answer and display the result.
        // this.fetchAnswer();
    };




    generateSentence() {
        if (this.state.view !== View.INPUT) {
            return;
        }
        const sentences = [
            // "Graduates continue to receive Christel House services while they continue their education.",
            // "I would continue the case if the consensus among the committee was to continue to do so.",
            // "The event will not continue, with the owner of the bar deciding not to continue  the tradition.",
            "Baldwin wanted to continue the tradition.",
            "I would certainly continue these tasks.",
            "But he obviously wants to continue his outing attempts.",
            "Garoff asks her to continue  her story .",
            "Cassandra chose to use her powers for good than to continue her evil deeds.",
            "You enjoy music, and I enjoy music.",
            // "Some goths may enjoy  hardcore punk , some may enjoy metal but generally they enjoy goth rock.",
            "I enjoy Wikipedia, and enjoy contributing to it as well.",
            "I especially enjoy good landscape pictures.",
            "He does not enjoy school trips.",
            "That's why I hate the book."
        ];

        const rnd = sentences[Math.floor(Math.random() * sentences.length)];
        (document.getElementById('inpsent')! as HTMLInputElement).value=rnd;
    }

    onFocusText(ev: React.FocusEvent<HTMLInputElement>){
        this.setState({view: View.INPUT});
        // console.log(ev);
    }

    // dostuff() {
    //     this.setState({view: this.state.view == View.INPUT ? View.RESULT : View.INPUT})
    // }

    render() {
        // const outer_state
        return (
            <React.Fragment>
                <FlexBoxVert>
                    <div style={{flex: this.state.view == View.INPUT ? 10 : 1}}>
                        <input id="inpsent" placeholder="Enter a sentence..." onKeyUp={this.handleQuerySubmit} onFocus={this.onFocusText}
                               style={{
                                   border: 'none', resize: 'none',
                                   fontSize: '30px',
                                   textAlign: 'center',
                                   transition: 'all 300ms ease-in-out',
                                   transform: this.state.view != View.INPUT ? 'scale(0.5,0.5)' : 'none',
                               }}/>
                        <DiceBut  style={{opacity: this.state.view == View.INPUT ? 1 : 0,}} >
                            <div  style={{cursor: this.state.view == View.INPUT ? 'pointer' : 'default'}} onClick={this.generateSentence}>Random</div>
                            <div  style={{cursor: this.state.view == View.INPUT ? 'pointer' : 'default'}} onClick={(e)=>this.fetchEmpties((document.getElementById('inpsent')! as HTMLInputElement).value)}>Predict</div>
                        </DiceBut>
                    </div>
                    <div style={{flex: this.state.view == View.INPUT ? 1 : 3,opacity: this.state.view == View.INPUT ? 0 : 1}}>
                        <Checker result={this.state.result} />
                    </div>
                    <div style={{flex: 1}}></div>
                    {/*<SubmitButton onClick={this.dostuff}>Submit</SubmitButton>*/}
                </FlexBoxVert>
                <HelpWidget/>

            </React.Fragment>
        )
    }
}

/**
 * The definitions below create components that we can use in the render
 * function above that have extended / customized CSS attached to them.
 * Learn more about styled components:
 * @see https://www.styled-components.com/
 *
 *
 * CSS is used to modify the display of HTML elements. If you're not familiar
 * with it here's quick introduction:
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS
 */

const DiceBut = styled.div`
    width:100%;
    text-align:center;
    transition: all 300ms ease-in-out;
    > div{
        cursor: pointer;
        background-color: ${({theme}) => theme.palette.background.dark};
        width: 200px;
        display: inline-block;
        border-radius: 5px;
        line-height: 40px;
        color: white;
        margin: 20px;
    }
    
    
`;


const FlexBoxVert = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 100%;
    > div{
        font-size: 20px;
        transition: all 300ms ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
`;


const Form = styled.form`
    margin: ${({theme}) => `0 0 ${theme.spacing.sm}`};
    max-width: 600px;
`;

const SubmitButton = styled(Button).attrs({
    // htmlType: 'submit',
    variant: 'primary'
})`
    margin: ${({theme}) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 0`};
`;

const SubmitContainer = styled.div`
    display: grid;
    grid-template-columns: min-content min-content;
    grid-gap: ${({theme}) => `${theme.spacing.xs} 0 0`};
    align-items: center;
`;

const InputLabel = styled.div`
    margin-top: ${({theme}) => theme.spacing.sm};
    margin-bottom: ${({theme}) => theme.spacing.xxs};
`;
