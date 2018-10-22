import * as React from 'react';

import './App.css';
import AudioProvider from './AudioProvider';
import PitchDetector from './PitchDetector';
import Recorder from './Recorder';
import Visualizer from './Visualizer';
import Waveform from './Waveform';

type State = {
  recordedAudio: string | null,
};

type Props = {};

class App extends React.Component<Props, State> {

  public state: State = {
    recordedAudio: '/ENaturalLow.mp3',
  };

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tone Analyzer</h1>
        </header>
        <AudioProvider
          renderLoading={() => 'Loading...'}
          renderError={msg => <span>{msg}</span>}
          renderWithStream={(audioStream, audioCtx) => (
            <React.Fragment>
              <Visualizer audioStream={audioStream} audioCtx={audioCtx} />
              {!this.state.recordedAudio ? null : <Waveform url={this.state.recordedAudio} />}
              {!this.state.recordedAudio ? null : <PitchDetector audioCtx={audioCtx} url={this.state.recordedAudio} />}
              <Recorder
                audioStream={audioStream}
                audioCtx={audioCtx}
                onRecordAudio={recordedAudio => this.setState({ recordedAudio })}
              />
            </React.Fragment>
          )}
        />
      </div>
    );
  }
}

export default App;
