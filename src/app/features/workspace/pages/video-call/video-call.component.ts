import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../../../shared/services/socket.service';
import { ChatService } from '../chat/data/chat.service';
import { AuthService } from '../../../auth/data/auth.service';
import { User } from '../../../../core/domain/entities/user.model';
import { Conversation } from '../../../../core/domain/entities/conversation.model';
import { Team } from '../../../../core/domain/entities/team.model';

@Component({
  selector: 'app-video-call',
  imports: [
    MatIcon
  ],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent implements AfterViewInit {

  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;

  private localMediaReady = false;
  private peerConnectionReady = false;
  private offerReceived = false;
  private hasOfferSent: boolean = false;
  private pendingSignal: any;

  private bufferedCandidates: RTCIceCandidate[] = [];
  private remoteDescriptionSet: boolean = false;

  check = 0;

  micOn = true;
  camOn = true;
  localStream!: MediaStream;
  peerConnection!: RTCPeerConnection;
  isCaller: boolean = false;

  private listenersSetup = false;

  chatDetails!: Conversation;
  currentUser!: User | null;
  remoteUser!: Team | undefined;

  msgId!: string;

  incomingSignal!: {
    from: string;
    to: string;
    type: 'offer';
    offer: RTCSessionDescriptionInit;
  };

  private currentUserReady = false;
  private remoteUserReady = false;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private chatSer: ChatService,
    private authSer: AuthService,
    private route: ActivatedRoute
  ) {

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { signal: any, from?: string };
    if (state?.from === 'caller') {
      this.chatDetails = state.signal as Conversation;
    } else if (state?.signal) {
      //This part is only for call accepting.
      //But Currently not making usage of incomingSignal.
      this.incomingSignal = state.signal;

    }


    const signal = history.state.signal;
    if (signal && signal.type === 'offer') {
      this.incomingSignal = signal;
      this.pendingSignal = signal;

      this.msgId = signal.msgId;

      this.remoteUser = {
        _id: signal.caller.id,
        name: signal.caller.name,
        email: signal.caller.email,
        profilePicUrl: '',
        role: signal.caller.role,
      }

    }

  }


  tryStartCall() {

    if (this.isCaller && this.currentUserReady && this.remoteUserReady && this.peerConnection) {

      this.startCall();
    }
  }


  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.isCaller = params['isCaller'] === 'true';
    })


    // If socket is already connected
    if (this.socketService.socket.connected) {
      this.setupSocketListeners();
    }

    this.socketService.socket.on('connect', () => {

      this.setupSocketListeners();
    });

    this.authSer.user$.subscribe({
      next: (res: User | null) => {
        if (res) {
          this.currentUser = res;
          this.currentUserReady = true;

          if (this.isCaller) {
            this.remoteUser = this.chatDetails.participants.find((user: Team) => this.currentUser!._id !== user._id);
            this.remoteUserReady = true;
            this.tryStartCall();
          }
        }
      },
      error: (err) => {
        console.error('Error occured while getting current user', err);
      }
    });

  }

  setupSocketListeners() {

    if (this.listenersSetup) return;
    this.listenersSetup = true;


    this.socketService.onSignal().subscribe(async (signal) => {

      if (!this.peerConnection || this.peerConnection.signalingState === 'closed') {
        console.warn('Ignoring signal: peer connection is closed or undefined.');
        return;
      }


      if (signal.type === 'answer') {

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.answer));
        this.remoteDescriptionSet = true;
        this.msgId = signal.msgId;

        for (const candidate of this.bufferedCandidates) {
          try {
            await this.peerConnection.addIceCandidate(candidate);
          } catch (err) {
            console.warn('Error adding buffered candidate:', err);
          }
        }

        this.bufferedCandidates = [];

      } else if (signal.type === 'candidate') {
        const candidate = new RTCIceCandidate(signal.candidate);

        if (this.peerConnection?.remoteDescription) {
          try {
            await this.peerConnection.addIceCandidate(candidate);
          } catch (err) {
            console.error('Failed to add ICE candidate:', err);
          }
        } else {
          // Optionally buffer candidates
          console.warn('Remote description not set. Candidate skipped or should be queued.');
          this.bufferedCandidates.push(candidate);
        }
      } else if (signal.type === 'call-ended') {
        console.log('call ended by remote user.');
        this.handleRemoteCallEnd();
      }
    });

  }

  async ngAfterViewInit() {

    await this.setupMedia();
    this.localMediaReady = true;

    if (!this.isCaller && this.pendingSignal && this.pendingSignal.type === 'offer' && this.peerConnectionReady) {

      this.handleOffer(this.pendingSignal);
    }

  }

  async setupMedia() {

    const video = this.localVideoRef.nativeElement;
    this.localVideoRef.nativeElement.muted = true;
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      video.srcObject = this.localStream;

      this.createPeerConnection();
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }

  }

  async handleOffer(signal: any) {

    // Step 1: Set remote description
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.offer));
    this.remoteDescriptionSet = true;

    // Step 2: Create answer
    const answer = await this.peerConnection.createAnswer();

    // Step 3: Set local description (your answer)
    await this.peerConnection.setLocalDescription(answer);




    const projectId = localStorage.getItem('projectId');
    // Step 4: Send answer back to caller
    this.socketService.sendSignal({
      type: 'answer',
      answer: answer,
      from: this.currentUser?._id,
      to: this.remoteUser?._id,

      projectId: projectId,
      convoId: signal.convoId,
      messageId: signal.msgId
    });


    // Step 5: Apply buffered ICE candidates
    for (const candidate of this.bufferedCandidates) {
      await this.peerConnection.addIceCandidate(candidate);
    }
    this.bufferedCandidates = []; // Clear after applying

  }



  async createPeerConnection() {

    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    //Remote video
    this.peerConnection.ontrack = (event) => {
      const [stream] = event.streams;

      if (stream) {
        this.remoteVideoRef.nativeElement.srcObject = stream;
      } else {
        console.warn('No stream received in ontrack');
      }
    };


    //Sending user  network info to remote user.
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {

        this.socketService.sendSignal({
          type: 'candidate',
          candidate: event.candidate,
          from: this.currentUser?._id,
          to: this.remoteUser?._id
        });
      }
    };


    this.peerConnectionReady = true;
    this.tryStartCall();

    // In case offer is already received
    if (!this.isCaller && this.pendingSignal && this.localMediaReady) {
      this.handleOffer(this.pendingSignal);
    }

  }


  async startCall() {

    if (this.hasOfferSent) {
      return;
    }
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    const projectId = localStorage.getItem('projectId');
    const messageId = null;
    this.socketService.sendSignal({
      type: 'offer',
      offer: offer,
      from: this.currentUser?._id,
      to: this.remoteUser?._id,
      projectId: projectId,
      convoId: this.chatDetails._id,
      messageId
    });

    this.hasOfferSent = true;
  }



  toggleMic() {
    this.micOn = !this.micOn;

    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = this.micOn;
    });

  }

  toggleCamera() {
    this.camOn = !this.camOn;

    this.localStream?.getVideoTracks().forEach(track => {
      track.enabled = this.camOn;
    });

  }




  handleRemoteCallEnd() {

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    alert('The call was ended by the other person.');
    this.router.navigate(['user/chat']);
  }

  endCall() {

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    this.socketService.sendSignal({
      type: 'call-ended',
      from: this.currentUser?._id,
      to: this.remoteUser?._id,
      messageId: this.msgId
    })

    this.router.navigate(['user/chat']);
  }




  ngOnDestroy() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }


}
