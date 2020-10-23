import React from 'react';
import isFunction from 'lodash/isFunction';
import partialRight from 'lodash/partialRight';
import forEach from 'lodash/forEach';

// const ReactAudio = React.forwardRef((props, ref) => {

    class ReactAudio extends React.Component {

        // static propTypes = {
        //     autoplay: React.PropTypes.bool,
        //     preload: React.PropTypes.bool,
        //     source: React.PropTypes.string,
        //     loop: React.PropTypes.bool,
        //     volume: React.PropTypes.number,
        //     onTimeupdate: React.PropTypes.func,
        //     onError: React.PropTypes.func,
        //     onProgress: React.PropTypes.func,
        //     onEnded: React.PropTypes.func
        // };

        static defaultProps = {
            autoplay: false,
            preload: true,
            source: "",
            loop: false,
            volume: .8,
            onTimeupdate: null,
            onError: null,
            onProgress: null,
            onEnded: null
        };

        constructor(props) {
            super(props)

            this.state = {
                listeners: []
            };

            // this.setAudioRef = element => {
            //     ref = element;
            //     this.audioElement = element;
            // }
        }

        handler(e, func) {
            if (isFunction(func)) {
                func(e);
            }
        }

        addListener = (event, func) => {
            this.audioElement.addEventListener(event, partialRight(this.handler, func));
            this.state.listeners.push({ event: event, func: func });
        }

        removeAllListeners = () => {
            forEach(this.state.listeners, (obj) => {
                this.audioElement.removeEventListener(obj.event, obj.func);
            })
            this.state.listeners = [];
        }

        componentDidMount() {
            this.addListener('timeupdate', this.props.onTimeupdate);
            this.addListener('progress', this.props.onProgress);
            this.addListener('error', this.props.onError);
            this.addListener('ended', this.props.onEnded);
            this.addListener('loadeddata', this.props.onLoadedData);
        }

        componentWillUnmount() {
            this.removeAllListeners();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {

            console.log('reactaudio . componentDidUpdate');
            console.log(this.props.source);
            if(this.props.source) this.audioElement.play();
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.autoplay === true && this.props.autoplay === false) {
                this.audioElement.play();
            }
        }

        togglePlay = () => {
            if (this.audioElement.paused)
                this.audioElement.play();
            else
                this.audioElement.pause();
        }

        setPlaybackPercent(percent) {
            this.audioElement.currentTime = percent * this.audioElement.duration;
        }

        changeCurrentTimeBy = (amount) => {
            this.audioElement.currentTime += amount;
        }

        setVolume = (percent) => {
            this.audioElement.volume = percent;
        }

        render() {
            return (
                <audio
                    ref={node => this.audioElement = node}
                    preload={this.props.preload}
                    volume={this.props.volume}
                    controls={false}
                    autoPlay={this.props.autoplay}
                    loop={this.props.loop}
                    src={this.props.source} />
            )
        }

    }

//     return <ReactAudio />
// })


export default ReactAudio;
