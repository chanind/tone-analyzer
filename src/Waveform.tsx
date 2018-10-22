import * as React from 'react';

type Props = {
  url: string,
};

type State = {
  surfer: any,
  loadedUrl: string | null,
};


class Waveform extends React.Component<Props, State> {

  public static getDerivedStateFromProps({ url }: Props, { surfer, loadedUrl }: State) {
    if (url !== loadedUrl && surfer) {
      surfer.load(url);
      return { loadedUrl: url };
    }
    return null;
  }

  public state: State = {
    loadedUrl: null,
    surfer: null,
  };

  private waveformRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const surfer = (window as any).WaveSurfer.create({
      audioRate: 0.7,
      container: this.waveformRef.current,
    });
    surfer.load(this.props.url);
    this.setState({ surfer, loadedUrl: this.props.url });
  }

  public render() {
    return (
      <div className="Waveform">
        <div ref={this.waveformRef} />
        {!this.state.surfer ? null : (
          <button onClick={() => this.state.surfer.playPause()}>Play/pause</button>
        )}
      </div>
    );
  }
};

export default Waveform
