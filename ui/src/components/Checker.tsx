import styled from 'styled-components';

import * as React from 'react';
import {Result} from '../api';
import {Loading} from "./shared";

interface CheckerProps {
    result?:Result
}
export  class Checker extends React.PureComponent<CheckerProps> {

    constructor(props: CheckerProps) {
        super(props);
        // this.state = {
        //
        // };
    }
    /**
     * Returns whether there is an answer and whether that answer is for
     * the current query.
     *
     * @returns {boolean}
     */

    render() {
        // const outer_state



        if(this.props.result === undefined){
            return (<Loading/>);
        }



        let splits:React.ReactNode[]= [];
        let last_offset=0;


        this.props.result!.elements.forEach( element=>{
            let chunk=this.props.result!.text.slice(last_offset,element.char_position);
            splits.push(<span key={'t'+last_offset}>{chunk}</span>);
            splits.push(<Check key={'e'+last_offset} completion={element.word}/>);
            last_offset=element.char_position;
        });


        splits.push(<span key={'t'+last_offset}>{this.props.result!.text.slice(last_offset)}</span>);





        return (
           <CheckerDiv>{splits}</CheckerDiv>
        )
    }
}

const Check: React.SFC<{ completion: string }> = ({ completion }) => (
    <CheckInner>
        <Tick />
        <InnerText>{completion}</InnerText>
    </CheckInner>
);
const InnerText =styled.div`
position: absolute;
top: -60px;
color: red;
width: 400px;
text-align: center;
display: block;
margin-left: -180px;
font-size: 40px;
`;

const CheckerDiv =styled.div`
    position: relative;
    font-size: 45px;
    line-height: 80px;

> div{
        display:inline-block;
        position: relative;
    }
`;
const  Tick =styled.div`
    display: inline-block;
    width: 15px;
    :before{
        background: transparent url('tick.png');
        content: "";
        background-size: cover;
        display: block;
        position: absolute;
        width: 60px;
        height: 60px;
        top: -8px;
        margin-left: -18px;
    }
`;

const CheckInner = styled.div`

    font-size:30px;
    
`;
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

