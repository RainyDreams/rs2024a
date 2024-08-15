<template>
  <div>
    <video ref="localVideo" autoplay playsinline></video>
    <video ref="remoteVideo" autoplay playsinline></video>
    <button @click="startCall">Start Call</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStream: null,
      remoteStream: null,
      peerConnection: null,
    };
  },
  methods: {
    async startCall() {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.$refs.localVideo.srcObject = this.localStream;

      this.peerConnection = new RTCPeerConnection();
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      this.peerConnection.ontrack = event => {
        this.remoteStream = event.streams[0];
        this.$refs.remoteVideo.srcObject = this.remoteStream;
      };

      this.peerConnection.onicecandidate = event => {
        if (event.candidate) {
          this.$socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.$socket.send(JSON.stringify({ type: 'offer', offer }));
    },
  },
  sockets: {
    connect() {
      console.log('WebSocket connected');
    },
    disconnect() {
      console.log('WebSocket disconnected');
    },
    message(data) {
      const message = JSON.parse(data);
      if (message.type === 'offer') {
        this.handleOffer(message.offer);
      } else if (message.type === 'answer') {
        this.handleAnswer(message.answer);
      } else if (message.type === 'candidate') {
        this.handleCandidate(message.candidate);
      }
    },
  },
  methods: {
    async handleOffer(offer) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.$socket.send(JSON.stringify({ type: 'answer', answer }));
    },
    async handleAnswer(answer) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    },
    async handleCandidate(candidate) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    },
  },
};
</script>

<style scoped>
video {
  width: 300px;
  height: 200px;
  margin: 10px;
}
</style>
