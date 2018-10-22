import Pitchfinder from 'pitchfinder';
import * as React from 'react';
import {Line as LineChart} from 'react-chartjs';

import './PitchDetector.css';

type Props = {
  url: string,
  audioCtx: AudioContext,
};

type State = {
  pitches: number[],
};


const QUANTIZATION = 1;
const TEMPO = 2000;

class PitchDetector extends React.Component<Props, State> {

  public state: State = {
    pitches: [],
  };

  public componentDidMount() {
    this.loadPitches(this.props.url);
  }

  public componentDidUpdate({ url }: Props) {
    if (url !== this.props.url) this.loadPitches(url);
  }

  public async loadPitches(url) {
    const audioArrayBuffer = await (await fetch(url)).arrayBuffer();
    const audioBuffer = await this.props.audioCtx.decodeAudioData(audioArrayBuffer);
    console.log(Pitchfinder);
    const pitches = Pitchfinder.frequencies(Pitchfinder.YIN({ threshold: 0.05 }), audioBuffer.getChannelData(0), {
      quantization: QUANTIZATION,
      tempo: TEMPO,
    });
    console.log(pitches);
    this.setState({ pitches });
  }

  public render() {
    const data = {
      datasets: [{
        data: this.state.pitches.slice(),
      }],
      labels: this.state.pitches.map((_pitch, i) => i),
    };

    return (
      <div className="PitchDetector">
        <h4>Pitches</h4>
        <div className="PitchDetector-pitches">
          {this.state.pitches.length === 0 ? null : (
            <LineChart data={data} options={{datasetFill: false}} width={window.innerWidth} height="150" />
          )}
        </div>
      </div>
    );
  }
};

export default PitchDetector
