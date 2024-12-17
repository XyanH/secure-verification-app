import PitchFinder from 'https://cdn.skypack.dev/pitchfinder';
// let fs;

// if (typeof window === 'undefined') {
//   // Node.js
//   fs = await import('fs');
// } else {
//   // Browser
//   console.log('Using File API or other browser alternatives');
// }

const detectPitch = PitchFinder.YIN();

let isPitchDetectionActive = false;
let isRecording = false;
let audioContext;
let analyser;
let audioData;
let mediaStream;
let mediaRecorder;

// async function transcribeAudio(filePath, expectedText) {
//   // Read the audio file
//   const audioBytes = fs.readFileSync(filePath).toString('base64');

//   // Configure the request
//   const audio = { content: audioBytes };
//   const config = {
//     encoding: 'LINEAR16', // Use appropriate encoding for your file
//     sampleRateHertz: 16000, // Set sample rate of your audio
//     languageCode: 'en-US', // Language of the audio
//   };
//   const request = { audio, config };

//   try {
//     // Perform speech recognition
//     const [response] = await client.recognize(request);
//     const transcription = response.results
//       .map((result) => result.alternatives[0].transcript)
//       .join('\n');

//     console.log('Transcription:', transcription);

//     // Compare with expected text
//     if (transcription.trim() === expectedText.trim()) {
//       console.log('✅ The transcription matches the expected text.');
//     } else {
//       console.log('❌ The transcription does not match the expected text.');
//       console.log('Expected:', expectedText);
//     }
//   } catch (err) {
//     console.error('Error during transcription:', err);
//   }
// }

async function startRecording() {
  if (isPitchDetectionActive) {
    stopPitchDetection(); // Stop if already running
    return;
  }

  const email = localStorage.getItem('email');

  if (!email) {
    alert('Email is missing. Please register again.');
    window.location.href = 'qregister.html'; // Redirect to login
    return;
  }

  console.log('Starting pitch detection...');
  isPitchDetectionActive = true;
  //   document.getElementById('stopRecording').disabled = false;

  try {
    //Access microphone
    console.log('microphone accessing...');
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    audioData = new Float32Array(analyser.fftSize);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }

    let audioChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const email = localStorage.getItem('email');
      await saveVoiceData(email, blob);

      //   // Save audio file locally for transcription
      //   const filePath = './recorded-audio.wav';
      //   const fileBuffer = Buffer.from(await blob.arrayBuffer());
      //   fs.writeFileSync(filePath, fileBuffer);

      //   // Perform transcription and compare with expected text
      //   const preparedText = 'Hello world'; // Replace with your expected text
      //   await transcribeAudio(filePath, preparedText);
    };

    mediaRecorder.start();
    console.log('Recording started...');
    isRecording = true;

    const pitchValues = []; // Pitch detection logic
    const processAudio = () => {
      if (!isRecording) {
        return; // Stop processing once recording is done
      }

      analyser.getFloatTimeDomainData(audioData);
      const pitch = detectPitch(audioData);

      if (pitch) {
        pitchValues.push(pitch);
        console.log(`Detected pitch: ${pitch} Hz`);
      }

      requestAnimationFrame(processAudio);
    };

    processAudio();

    // Stop recording after 5 seconds
    setTimeout(stopRecording, 5000);
    // document.getElementById('stopRecording').disabled = true;
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}

function stopRecording() {
  if (!isRecording || !mediaRecorder) return;

  console.log('Stopping recording...');
  mediaRecorder.stop();
  isRecording = false;

  if (audioContext) audioContext.close();
  if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
}

// Function to send voice data to the backend
async function saveVoiceData(email, blob) {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('file', blob, `${email}.webm`); // Append the audio file
    formData.append('email', email); // Append email

    // Send the POST request
    const response = await fetch('http://localhost:3000/voice/save-voice', {
      method: 'POST',
      body: formData, // Send FormData
    });

    const result = await response.json();
    console.log('Server response:', result);
    if (response.ok && result.success) {
      alert('Voice data saved successfully.');
      window.location.href = 'voice4.html'; // Redirect to the next page
      localStorage.removeItem('email');
    } else {
      alert(result.message || 'Failed to save voice data.');
      window.location.href = 'voice5.html';
    }
  } catch (error) {
    console.error('Error saving voice data:', error);
  }
}

//stop recording manually
document.getElementById('stopRecording').addEventListener('click', async () => {
  if (!isRecording || !mediaRecorder) {
    console.log('No recording in progress.');
    return;
  }

  console.log('Stop recording...');
  mediaRecorder.stop();
  isRecording = false;

  if (audioContext) {
    audioContext.close();
  }
  mediaStream.getTracks().forEach((track) => track.stop()); // Stop the microphone
  //   document.getElementById('stopRecording').disabled = true; // Disable Stop button
});

startRecording();
