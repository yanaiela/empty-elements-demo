import styled from 'styled-components';

import * as React from 'react';
import {Result} from '../api';

interface EmptyProps {

}
interface State {
    infoOpen:boolean
}

export class HelpWidget extends React.PureComponent<EmptyProps,State> {



    constructor(p:EmptyProps){
        super(p);
        this.state={infoOpen:false}
        this.closeInfo=this.closeInfo.bind(this);
        this.toggleInfo=this.toggleInfo.bind(this);
    }
    /**
     * Returns whether there is an answer and whether that answer is for
     * the current query.
     *
     * @returns {boolean}
     */

    closeInfo(){
         this.setState({infoOpen:false})
    }
    toggleInfo(){
        this.setState(state=>({infoOpen:!state.infoOpen}));
    }

    render() {
        // const outer_state

        return (
            <Info >
                <Button onClick={this.toggleInfo}/>
                <div className="inner" style={{transform:this.state.infoOpen? 'rotate(-4deg) translate(-20px, 35px) scale(1)':'rotate(51deg) translate(312px, 6px) scale(0.1)' }}>
                    <CloseButton onClick={this.closeInfo}/>
                    <div style={{overflow:'auto',height:'100%',  padding: '30px'}}>
                        <h3>What are empty elements?</h3>
                        <p>Elments that are empty.
                        </p>
                        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                            ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.</p>

                        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                            ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.</p>
                        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                            ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            </Info>
        )
    }
}

const Info = styled.div`
    position: absolute;
    right: 0px;
    bottom: 0px;
    
    
    > .inner {
        border: solid 2px #444259;
        height: 400px;
        position: absolute;
        right: 43px;
        bottom: 80px;
        width: 400px;
        border-radius: 7px;
        background-color: #fbfaff;
        box-shadow: 5px 5px 5px #0006;
        font-size: 20px;
        transition: all 300ms ease-in-out;
        // transform: rotate(51deg) translate(312px, 6px) scale(0.1);
        z-index: 20;
    }
    
    
`;

const Button = styled.div`
    cursor: pointer;
    width: 90px;
    height: 90px;
    border-radius: 200px;
    display: block;
    background-color: ${({theme}) => theme.palette.background.dark};
    color: white;
    text-align: center;
    line-height: 90px;
    font-size: 60px;
    font-weight: 800;
    box-shadow: 5px 5px 5px #0006;
    z-index: 40;
    position: absolute;
    bottom: 0;
    right: 0;
    :after{
        content:"?";
    }
`;

const CloseButton = styled.div`
    
    cursor: pointer;
    width: 35px;
    height: 35px;
    border-radius: 200px;
    display: block;
    background-color: #444259;
    color: white;
    text-align: center;
    line-height: 35px;
    font-size: 21px;
    font-weight: 100;
    box-shadow: 5px 5px 5px #0006;
    top: -14px;
    position: absolute;
    right: -12px;
    font-family: ariel;
    
    :after{
        content:"✖";
    }
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

