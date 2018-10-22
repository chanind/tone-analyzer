import * as React from 'react';

type Props = {
  audioStream: MediaStream,
  audioCtx: AudioContext,
  onRecordAudio: (url: string) => void,
};

type State = {
  isRecording: boolean,
};

class Recorder extends React.Component<Props, State> {

  public state: State = {
    isRecording: false,
  };

  private recorder;

  public render() {
    return (
      <div className="Recorder">
        <button onClick={this.onToggleRecording}>
          {this.state.isRecording ? 'Stop' : 'Record'}
        </button>
      </div>
    );
  }

  private onProcessData = async (data) => {
    const blob = new Blob(data);
    const url = URL.createObjectURL(blob);
    // const audioArrayBuffer = await (await fetch('/shengri.mp3')).arrayBuffer();
    // const audioBuffer = await this.props.audioCtx.decodeAudioData(audioArrayBuffer);
    // console.log('processed audio!')
    this.props.onRecordAudio(url);
  }

  private onToggleRecording = () => {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }
    if (!this.state.isRecording) {
      const data: any[] = [];
      this.recorder = new (window as any).MediaRecorder(this.props.audioStream);
      this.recorder.ondataavailable = e => e.data.size && data.push(e.data);
      this.recorder.start();
      this.recorder.onstop = () => this.onProcessData(data);
    }
    this.setState({ isRecording: !this.state.isRecording });
  }
};

export default Recorder
