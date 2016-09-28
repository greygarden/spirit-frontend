// -------------------------------------------------------------
// The authentication / login page.
// -------------------------------------------------------------

import React from 'react'
import authHelper from '../libs/auth-helper.js'
import recess from 'react-recess'
import apiLayer from '../libs/api-layer.js'
import sharedStyles from '../libs/shared-styles'
import TriangleBG from '../libs/triangles'

// Validate email with a basic regex. Any number of characters, then an '@', then at least one character, then '.', then anything.
const emailRegex = new RegExp(/^.+@.+\..+/);

export default class Auth extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            usernameDialog: {
                visible: false,
                text: ''
            },
            passwordDialog: {
                visible: false,
                text: ''
            },
            email: '',
            password: ''
        };
    }

    updateEmail (event) {
        this.setState({
            email: event.target.value
        });
        event.preventDefault();
    }

    updatePassword (event) {
        this.setState({
            password: event.target.value
        });
        event.preventDefault();
    }

    validate (event) {
        let success = true;

        this.setState({
            passwordDialog: {
                visible: false,
            },
            usernameDialog: {
                visible: false,
            }
        });

        if (this.state.password.length < 8) {
            this.setState({
                passwordDialog: {
                    visible: true,
                    text: 'This password is too short. (Minimum 8 characters)'
                }
            });
            success = false;
        }

        if (!emailRegex.test(this.state.email)) {
            this.setState({
                usernameDialog: {
                    visible: true,
                    text: 'This email is invalid.'
                }
            });
            success = false;
        }
        return success;
    }

    login () {
        if (!this.validate()) { return }
        this.setState({ loginLoading: true });

        apiLayer.auth.login(this.state.email, this.state.password)
        .then(function (data) {
            if (data.errors.length > 0) {
                this.setState({
                    usernameDialog: {
                        visible: true,
                        text: data.errors[0]
                    },
                    loginLoading: false
                });
            } else {
                // Redirect to the default logged in app
                window.location.href = '/app';
            }
        }.bind(this))
        .error(function () {
            this.setState({
                usernameDialog: {
                    visible: true,
                    text: 'Login failed due to an unknown error.'
                },
                loginLoading: false
            });
        });
    }

    signup () {
        if (!this.validate()) { return }
        this.setState({ signupLoading: true });

        apiLayer.auth.signup(this.state.email, this.state.password)
        .then((data) => {
            if (data.errors.length > 0) {
                this.setState({
                    usernameDialog: {
                        visible: true,
                        text: data.errors[0]
                    },
                    signupLoading: false
                });
            } else {
                this.login(email, password);
            }
        })
        .error(() => {
            this.setState({
                usernameDialog: {
                    visible: true,
                    text: 'Sign up failed due to an unknown error.'
                },
                loginLoading: false
            });
        });
    }

    componentDidMount () {
        // Set the title of the page
        document.title = 'Login - Spirit';

        var triangle = new TriangleBG({
            canvas : this.refs.canvas,
            cellHeight : 120,
            cellWidth : 100,
            mouseLight : true,
            mouseLightRadius : 500,
            mouseLightIncrement : 10,
            resizeAdjustment : true,
            variance : 1.2  ,
            pattern : "x*y",
            baseColor1 : {
              baseHue : 211,
              baseSaturation : 14,
              baseLightness : 39
            },
            baseColor2 : {
              baseHue : 211,
              baseSaturation : 14,
              baseLightness : 40
            },
            colorDelta : {
              hue : 1,
              lightness : 0,
              saturation : 0
            }
        });
    }

    render () {
        const authStyles = {
            '.authOuter': {
                height: '100%',
                display: 'flex',

                '.left': {
                    width: '435px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#556270',
                    position: 'relative',

                    '.canvas': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                    },

                    '.topBar': {
                        padding: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',

                        '.logo': {
                            background: '#83AF9B',
                            width: '70px',
                            height: '80px',
                            color: '#fff',
                            fontSize: '26px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            lineHeight: '1.2',
                            marginRight: '25px'
                        },

                        '.title': {
                            color: '#fff',
                            font: '200 26px "Open Sans"',

                            '.subtitle': {
                                marginTop: '5px',
                                font: '400 15px "Open Sans"',
                                color: '#ddd'
                            }
                        }
                    },

                    '.authBody': {
                        flexGrow: '1',
                        display: 'flex',
                        padding: '0 40px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#fff',
                        position: 'relative',

                        '.upper': {
                            fontSize: '22px',
                            marginBottom: '15px'
                        },

                        '.form': {
                            display: 'flex',
                            flexWrap: 'wrap',

                            'div': {
                                flexBasis: '100%',
                                display: 'flex',
                                position: 'relative',

                                'input': {
                                    background: 'none',
                                    border: 'none',
                                    font: '200 16px "Open Sans"',
                                    borderBottom: '2px solid #fff',
                                    padding: '8px 12px',
                                    marginBottom: '25px',
                                    flexGrow: 1,
                                    color: '#fff'
                                },
                            }
                        },

                        '.submit': {
                            padding: '10px 12px',
                            background: '#fff',
                            font: '400 14px "Open Sans"',
                            color: '#556270',
                            width: '120px',
                            textAlign: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            '@includes': [ sharedStyles.loader ],

                            ':hover': {
                                background: '#eee'
                            },

                            ':active': {
                                background: '#ddd'
                            }
                        },

                        '.error': {
                            background: '#FE4365',
                            padding: '10px',
                            width: '100%',
                            display: 'none',
                        },

                        '.active': {
                            display: 'block'
                        }
                    }
                },

                '.right': {
                    flexGrow: '1',
                    backgroundImage: `url("${process.env.ASSET_URL}/splash.jpeg")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%'
                }
            }
        }
        let auth = (
            <div className='authOuter'>
                <div className='left'>
                    <canvas className='canvas' ref='canvas'></canvas>
                    <div className='topBar'>
                        <div className='logo'>
                            <div>核</div>
                            <div>心</div>
                        </div>
                        <div className='title'>
                            Spirit
                            <div className='subtitle'>Hydroponics Monitoring And Automation</div>
                        </div>
                    </div>
                    <div className='authBody'>
                        <div className='upper'>Login to access Spirit.</div>
                        <div className='form'>
                            <div>
                                <input value={this.state.email} type='text' placeholder='Email' ref='email' onChange={this.updateEmail.bind(this)}></input>
                            </div>
                            <div>
                                <input value={this.state.password} type='password' className='last' placeholder='Password' ref='password' onChange={this.updatePassword.bind(this)}></input>
                            </div>
                        </div>
                        <div className='submit' onClick={this.login.bind(this)}>
                            <div className={`loaderOuter${this.state.loginLoading ? ' active' : ''}`}>
                                <div className='loader'></div>
                            </div>
                            LOGIN
                        </div>
                        <div className={'error dialog' + (this.state.usernameDialog.visible ? ' active' : '')}>{this.state.usernameDialog.text}</div>
                        <div className={'error dialog' + (this.state.passwordDialog.visible ? ' active' : '')}>{this.state.passwordDialog.text}</div>
                    </div>
                </div>
                <div className='right'></div>
            </div>
        );

        auth = recess(auth, authStyles, this);

        return auth;
    }
};