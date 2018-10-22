import * as React from 'react';

import './Visualizer.css';

type Props = {
  audioStream: MediaStream,
  audioCtx: AudioContext,
};

type State = {
  analyzer: any,
  dataArray: Uint8Array,
};

class Visualizer extends React.Component<Props, State> {

  public static getDerivedStateFromProps({ audioStream, audioCtx }: Props, prevState: State) {
    if (!prevState.analyzer) {
      const source = audioCtx.createMediaStreamSource(audioStream);
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 2048;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyzer);
      return { analyzer, dataArray };
    }
    return null;
  }

  public state: State = {
    analyzer: null,
    dataArray: new Uint8Array(0),
  };

  private canvasRef = React.createRef<HTMLCanvasElement>();

  public componentDidMount() {
    this.draw();
  }

  public render() {
    return (
      <div className="Visualizer">
        <canvas className="Visualizer-canvas" ref={this.canvasRef} />
      </div>
    );
  }

  private draw = () => {
    const canvas = this.canvasRef.current;
    const { analyzer, dataArray } = this.state;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const WIDTH = canvas.width
    const HEIGHT = canvas.height;
    const bufferLength = analyzer.frequencyBinCount;

    requestAnimationFrame(this.draw);

    analyzer.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {

      const v = dataArray[i] / 128.0;
      const y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  }
};

export default Visualizer
