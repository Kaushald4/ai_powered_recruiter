class RecognizerProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input.length > 0) {
            // Get the first channel of audio data
            const inputData = input[0];
            // Post the audio data to the main thread
            this.port.postMessage(inputData.slice());
        }
        return true;
    }
}

registerProcessor("recognizer-processor", RecognizerProcessor);
