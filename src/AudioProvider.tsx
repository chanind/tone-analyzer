import * as React from 'react';

type Props = {
  renderLoading: () => React.ReactNode,
  renderError: (message: string) => React.ReactNode,
  renderWithStream: (audioStream: MediaStream, audioCtx: AudioContext) => React.ReactNode,
};

type State = {
  audioStream: MediaStream | null,
  error: string | null,
};

const audioCtx: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();


class AudioProvider extends React.Component<Props, State> {

  public state: State = {
    audioStream: null,
    error: null,
  };

  public async componentDidMount() {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.setState({ audioStream });
    } catch (e) {
      console.error(e);
      this.setState({ error: 'Error accessing audio' });
    }
  }

  public render() {
    const { audioStream, error } = this.state;
    return (
      <React.Fragment>
        {!audioStream && !error ? this.props.renderLoading() : null}
        {error ? this.props.renderError(error) : null}
        {audioStream ? this.props.renderWithStream(audioStream, audioCtx) : null}
      </React.Fragment>
    );
  }
};

export default AudioProvider
